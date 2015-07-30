jQuery.sap.require("sap.ui.demo.app.util.Formatter");

sap.ui.core.mvc.Controller.extend("sap.ui.demo.app.view.Master", {

	onInit : function() {
		this.oUpdateFinishedDeferred = jQuery.Deferred();

		this.getView().byId("list").attachEventOnce("updateFinished", function() {
			this.oUpdateFinishedDeferred.resolve();
		}, this);

		sap.ui.core.UIComponent.getRouterFor(this).
			attachRouteMatched(this.onRouteMatched, this);
	},

	onRouteMatched : function(oEvent) {
		var oList = this.getView().byId("list");
		var sName = oEvent.getParameter("name");
		var oArguments = oEvent.getParameter("arguments");

		// Wait for the list to be loaded once
		jQuery.when(this.oUpdateFinishedDeferred).then(jQuery.proxy(function() {
			var aItems;

			// On the empty hash select the first item
			if (sName === "main") {
				this.selectDetail();
			}

			// Try to select the item in the list
			if (sName === "product") {

				aItems = oList.getItems();
				for (var i = 0; i < aItems.length; i++) {
					if (aItems[i].getBindingContext().getPath() === "/" + oArguments.product) {
						oList.setSelectedItem(aItems[i], true);
						break;
					}
				}	
			}	

		}, this));
	},

	selectDetail : function() {
		if (!sap.ui.Device.system.phone) {
			var oList = this.getView().byId("list");
			var aItems = oList.getItems();
			if (aItems.length && !oList.getSelectedItem()) {
				oList.setSelectedItem(aItems[0], true);
				this.showDetail(aItems[0]);
			}
		}
	},

	onSearch : function() {
		// add filter for search
		var filters = [];
		var searchString = this.getView().byId("searchField").getValue();
		if (searchString && searchString.length > 0) {
			filters = [ new sap.ui.model.Filter(
						"Name",
						sap.ui.model.FilterOperator.Contains, 
						searchString)
					  ];
		}

		// update list binding
		this.getView().byId("list").getBinding("items").filter(filters);
	},

	onSelect : function(oEvent) {
		// Get the list item, either from the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode).
		this.showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
	},

	showDetail : function(oItem) {
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("product", {
			from: "master",
			product: oItem.getBindingContext().getPath().substr(1),
			tab: "supplier"
		}, bReplace);
	},

	onAddProduct : function() {
		sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
			currentView : this.getView(),
			targetViewName : "sap.ui.demo.app.view.AddProduct",
			targetViewType : "XML",
			transition : "slide"
		});
	}
});