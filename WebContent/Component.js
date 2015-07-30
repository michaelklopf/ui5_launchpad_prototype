jQuery.sap.declare("sap.ui.demo.app.Component");
jQuery.sap.require("sap.ui.demo.app.MyRouter");

sap.ui.core.UIComponent.extend("sap.ui.demo.app.Component", {
	// setting configuration
	metadata : {
		// general part
        name : "Open UI5 Demo",

        version : "1.0",

        includes : [],

        dependencies : {
            libs : ["sap.m", "sap.ui.layout"],
            components : []
    	},

 		//rootView : "sap.ui.demo.app.view.App",
 		// use rootView when view is not enhanced with additional data
 		// else use createContent

 		// config part obviously
 		// disable the security of the browser to make the following work
 		// start Chrome with the arguments --disable-web-security
 		// or setup a proxy URL on the server that redirects requests
 		// TODO: try it with RESTler/Gulp/Grunt
 		config : {
            resourceBundle : "i18n/messageBundle.properties",
            serviceConfig : {
                // name: "ZFLX_EREC_GW_SRV",
                // serviceUrl: "/sap/opu/odata/sap/ZFLX_EREC_GW_SRV/"
                name : "Northwind",
                serviceUrl : 
                	"http://services.odata.org/V2/(S(sapuidemotdg))/OData/OData.svc/"
            }
    	},

    	// routing part obviously
        // is part of step 3 of the tutorial
        // router is initialized in init function below
    	routing: {
    		config: {
    			// custom router class
    			routerClass : sap.ui.demo.app.MyRouter,
    			// xml views
    			viewType : "XML",
    			// absolute path to views
    			viewPath : "sap.ui.demo.app.view",
    			// unless stated otherwise, router places view in detail part
    			targetAggregation : "pages",
    			// don't clear the detail pages before views are added
    			clearTarget : false
    		},

    		// note that routes are defined in array
    		routes : [
                {
                    pattern : "",
                    name: "launchpad",
                    view: "Launchpad",
                    targetControl: "masterView"
                },
    			// routing of the main part of the application
                {
                    pattern : "split",
                    name: "app",
                    view: "App",
                    targetControl: "masterView",
        			subroutes : [
                        {
            				pattern : "master",
            				name : "main",
            				// placed in master masterPages aggregation of splitapp
            				view : "Master",
            				targetAggregation : "masterPages",
            				targetControl : "idAppControl",
            				// places detail in detailPages aggreg. of the splitapp
            				subroutes : [
            					{
            						// product context is expected
            						// and which tab should be selected (supplier/category)
            						pattern : "{product}/:tab:",
            						name : "product",
            						view : "Detail",
                                    targetAggregation :  "detailPages"
            					}
            				]
                        }
                    ]
    			},
    			// catchall routes, to show not found message, when route is not valid
    			{
    				name : "catchallMaster",
    				view : "Master",
    				targetAggregation : "masterPages",
    				targetControl : "idAppControl",
    				subroutes : [
    					{
    						pattern : ":all*:",
    						name : "catchallDetail",
    						view : "NotFound"
    					}
    				]
    			}
    		]
    	}
    	// custom routing is performed in MyRouter.js
    },

  	init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        var mConfig = this.getMetadata().getConfig();

        // always use absolute paths relative to our own component
        // (relative paths will fail if running in the Fiori Launchpad)
        var rootPath = jQuery.sap.getModulePath("sap.ui.demo.app");

        // set i18n model - links to folder i18n
        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : [rootPath, mConfig.resourceBundle].join("/")
        });
        this.setModel(i18nModel, "i18n");
        
        // Create and set domain model to the component
        // - taken from above service config above
        var sServiceUrl = mConfig.serviceConfig.serviceUrl;
        var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
        this.setModel(oModel);

        // maybe relevant to testing:
        // var sProxyOn = jQuery.sap.getUrlParameters().get("proxyOn");
        // var bUseProxy = ("true" === sProxyOn);
        // if (bUseProxy) {
        //  sServiceUrl = rootPath + "/proxy" + sServiceUrl;   
        // }

        // start mock server if required
        // var responderOn = jQuery.sap.getUrlParameters().get("responderOn");
        // var bUseMockData = ("true" === responderOn);
        // if (bUseMockData) {
        //    jQuery.sap.require("sap.ui.app.MockServer");
        //    var oMockServer = new sap.ui.app.MockServer({
        //      rootUrl: sServiceUrl
        //    });
        //    oMockServer.simulate(rootPath + "/model/metadata.xml" + rootPath + "/model");
        //    oMockServer.start();
        //    var msg = "Running in demo mode with mock data";
        //    jQuery.sap.require("sap.m.MessageToast");
        //    sap.m.MessageToast.show(msg, {
        //         duration: 4000    
        //    });
        // }

        // set device model - for responsiveness that is not part of the controls
        // (some is implicit, this is for the explicit part)
        var deviceModel = new sap.ui.model.json.JSONModel({
            isTouch : sap.ui.Device.support.touch,
            isNoTouch : !sap.ui.Device.support.touch,
            isPhone : sap.ui.Device.system.phone,
            isNoPhone : !sap.ui.Device.system.phone,
            listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
            listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
        });

        deviceModel.setDefaultBindingMode("OneWay");
        this.setModel(deviceModel, "device");
        
        this.getRouter().initialize();
    },

    createContent: function() {
        var oViewData = {
            component:this
        };
        return sap.ui.view({
            viewName: "sap.ui.demo.app.view.MasterApp",
            type: sap.ui.core.mvc.ViewType.XML,
            viewData: oViewData
        });
    }
});