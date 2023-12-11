"use strict";
//Выход из личного кабинета
let logout = new LogoutButton();
logout.action = () => ApiConnector.logout(response=>{
	if(response.success){
		location.reload()
	}
});
//Получение информации о пользователе
ApiConnector.current(response => {
	if(response.success){
		 ProfileWidget.showProfile(response.data)
	}
});
//Получение текущих курсов валюты
let rate = new RatesBoard();
function getStock() {
	ApiConnector.getStocks(response => {
		if (response.success) {
			rate.clearTable();
			rate.fillTable(response.data);
		}
	}
)}
getStock();
setInterval(getStock, 60000);
//Операции с деньгами
let money = new MoneyManager();
//пополнение баланса
money.addMoneyCallback = data => ApiConnector.addMoney(data, user => {
		if(user.success) {
			ProfileWidget.showProfile(user.data);
			money.setMessage(true, 'Ваш баланс пополнен на ' + data.amount + ' ' + data.currency);
		} else {
			money.setMessage(false, user.error);
		}
	}
);
//конвертация валюты
money.conversionMoneyCallback = data => ApiConnector.convertMoney(data, user => {
		if(user.success) {
			ProfileWidget.showProfile(user.data);
			money.setMessage(true, 'Конвертация ' + data.fromAmount + ' ' + data.fromCurrency + ' в ' + data.targetCurrency + ' прошла успешно');
		} else {
			money.setMessage(false, user.error);
		}
	}
);
//перевод валюты
money.sendMoneyCallback = data => ApiConnector.transferMoney(data, user => {
		if(user.success) {
			ProfileWidget.showProfile(user.data);
			money.setMessage(true, 'Перевод для пользователя с ID = ' + data.to + ' в размере ' + data.amount + ' ' + data.currency + ' выполнен успешно');
		} else {
			money.setMessage(false, user.error);
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
favorite.addUserCallback = data => ApiConnector.addUserToFavorites(data, addUser => {
	if(addUser.success) {
		favorite.clearTable();
		favorite.fillTable(addUser.data);
		money.updateUsersList(addUser.data);
		favorite.setMessage(true, 'Пользователь успешно добавлен в список избранных');
	} else {
		favorite.setMessage(false, addUser.error);
	}
	}
);
//удаление пользователя из избранного
favorite.removeUserCallback = data => ApiConnector.removeUserFromFavorites(data, removeUser => {
		if(removeUser.success) {
			favorite.clearTable();
			favorite.fillTable(removeUser.data);
			money.updateUsersList(removeUser.data);
			favorite.setMessage(true, 'Пользователь успешно удален из списка избранных');
		} else {
			favorite.setMessage(false, removeUser.error);
		}
	}
);