jQuery.sap.declare("sap.ui.demo.app.util.Formatter");

sap.ui.demo.app.util.Formatter = {

	uppercaseFirstChar : function(lowerCaseString) {
		return lowerCaseString.charAt(0).toUpperCase()
			 + lowerCaseString.slice(1);
	},

	discontinuedStatusState : function(sDate) {
		return sDate ? "Error" : "None";
	},

	discontinuedStatusValue : function(sDate) {
		return sDate ? "Discontinued" : "";
	},

	currencyValue : function (currencyValue) {
		return parseFloat(currencyValue).toFixed(2);
	}

};