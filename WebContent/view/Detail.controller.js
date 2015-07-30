sap.ui.core.mvc.Controller.extend("sap.ui.demo.app.view.Detail", {

	onInit : function() {
		var oView = this.getView();

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
			// when detail navigation occurs, update the binding context
			if (oEvent.getParameter("name") === "product") {

				var sProductPath = "/" + oEvent.getParameter("arguments").product;

				oView.bindElement(sProductPath);

				// Check that the product specified actually was found
				oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
					var oData = oView.getModel().getData(sProductPath);
					if (!oData) {
						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							currentView : oView,
							targetViewName : "sap.ui.demo.app.view.NotFound",
							targetViewType : "XML"
						});
					}
				}, this));


				// Make sure the master is here
				var oIconTabBar = oView.byId("idIconTabBar");
				oIconTabBar.getItems().forEach(function(oItem) {
					oItem.bindElement(sap.ui.demo.app.util.Formatter.uppercaseFirstChar(oItem.getKey()));
				});

				// Which tab?
				var sTabKey = oEvent.getParameter("arguments").tab || "supplier";
				if (oIconTabBar.getSelectedKey() !== sTabKey) {
					oIconTabBar.setSelectedKey(sTabKey);
				}
			}
		}, this);
	},

	onNavBack : function() {
		// This is only relevant when running on phone devices, launchpad is defined in Component.js
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("launchpad");
	},

	onDetailSelect : function(oEvent) {
		sap.ui.core.UIComponent.getRouterFor(this).navTo("product",{
			product : oEvent.getSource().getBindingContext().getPath().slice(1),
			tab: oEvent.getParameter("selectedKey")
		}, true);
	}

});
