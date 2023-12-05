"use strict";

let logout = new LogoutButton();
logout.action = e => ApiConnector.logout(response => response.success ? location.reload() : alert(response.error));

ApiConnector.current(response => response ? ProfileWidget.showProfile(response) : alert("Ошибка получения текущего пользователя"));

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

