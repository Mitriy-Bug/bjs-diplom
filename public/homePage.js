"use strict";

//Выход из личного кабинета
let logout = new LogoutButton();
logout.action = e => ApiConnector.logout(response => response.success ? location.reload() : alert(response.error));

//Получение информации о пользователе
ApiConnector.current(response => response ? ProfileWidget.showProfile(response.data) : alert("Ошибка получения текущего пользователя"));

//Получение текущих курсов валюты
let rate = new RatesBoard();

function getStock() {
	ApiConnector.getStocks((response) => {
		if (response) {
			rate.clearTable();
			rate.fillTable(response.data);
		}
	}
)}
getStock();

let timerId;
timerId = setTimeout(function work() {
  getStock();
  timerId = setTimeout(work, 60000)
}, 60000)

//Операции с деньгами
let money = new MoneyManager();
//пополнение баланса
money.addMoneyCallback = data => ApiConnector.addMoney({ currency: data.currency, amount: data.amount }, p => {
		if(data.currency && data.amount) {
			ProfileWidget.showProfile(p.data);
			money.setMessage(true, 'Ваш баланс пополнен на ' + data.amount + ' ' + data.currency);
		} else {
			money.setMessage(false, 'Ошибка пополнения баланса. Заполните сумму перевода и выберите валюту');
		}
	}
);
//конвертация валюты
money.conversionMoneyCallback = data => ApiConnector.convertMoney({ fromCurrency: data.fromCurrency, targetCurrency: data.targetCurrency, fromAmount: data.fromAmount }, p => {
		if(data.fromCurrency && data.targetCurrency && data.fromAmount) {
			ProfileWidget.showProfile(p.data);
			money.setMessage(true, 'Конвертация ' + data.fromAmount + ' ' + data.fromCurrency + ' в ' + data.targetCurrency + ' прошла успешно');
		} else {
			money.setMessage(false, 'Ошибка конвертации валюты. Заполните все необходимые поля');
		}
	}
);
//перевод валюты
money.sendMoneyCallback = data => ApiConnector.transferMoney({ to: data.to, currency: data.currency, amount: data.amount }, p => {
		console.log(data);
		if(data.to && data.currency && data.amount) {
			ProfileWidget.showProfile(p.data);
			money.setMessage(true, 'Перевод для пользователя с ID = ' + data.to + ' в размере ' + data.amount + ' ' + data.currency + ' выполнен успешно');
		} else {
			money.setMessage(false, 'Ошибка перевода валюты. Заполните все необходимые поля');
		}
	}
);

//Работа с избранным
let favorite = new FavoritesWidget();
//начальный список избранного
ApiConnector.getFavorites(response => {
	if(response.success){
		favorite.clearTable();
		favorite.fillTable(response.data);
		money.updateUsersList(response.data);
		favorite.setMessage(true, 'Список избранных успешно обновлен');
	} else {
		favorite.setMessage(false, response.error);
	}
});
//добавления пользователя в список избранных
favorite.addUserCallback = data => ApiConnector.addUserToFavorites({id: data.id, name: data.name}, p => {
		if(data.id && data.name) {
			favorite.clearTable();
			favorite.fillTable(p.data);
			money.updateUsersList(p.data);
			favorite.setMessage(true, 'Пользователь успешно добавлен в список избранных');
		} else {
			favorite.setMessage(false, 'Ошибка добавления в избранные. Заполните все поля');
		}
	}
);
//удаление пользователя из избранного
favorite.removeUserCallback = data => ApiConnector.removeUserFromFavorites(data, p => {
	console.log(data)
		if(data) {
			favorite.clearTable();
			favorite.fillTable(p.data);
			money.updateUsersList(p.data);
			favorite.setMessage(true, 'Пользователь успешно удален из списка избранных');
		} else {
			favorite.setMessage(false, p.error);
		}
	}
);