sap.ui.core.mvc.Controller.extend("sap.ui.demo.app.view.Launchpad", {
  toSplit: function() {
    sap.ui.core.UIComponent.getRouterFor(this).myNavBack("main", {});
  },

  onInit : function (evt) {
    // set mock model
    var sPath = jQuery.sap.getModulePath("sap.ui.demo.app", "/model/tiles.json");
    var oModel = new sap.ui.model.json.JSONModel(sPath);
    this.getView().setModel(oModel);
  },

  handleEditPress : function (evt) {
    var oTileContainer = this.getView().byId("container");
    var newValue = ! oTileContainer.getEditable();
    oTileContainer.setEditable(newValue);
    evt.getSource().setText(newValue ? "Done" : "Edit");
  },

  handleBusyPress : function (evt) {
    var oTileContainer = this.getView().byId("container");
    var newValue = ! oTileContainer.getBusy();
    oTileContainer.setBusy(newValue);
    evt.getSource().setText(newValue ? "Done" : "Busy state");
  },

  handleTileDelete : function (evt) {
    var tile = evt.getParameter("tile");
    evt.getSource().removeTile(tile);
  }
});