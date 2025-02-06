var strFeedbackTable = "Forecasts SE RTP2027 Feedback"; //table with OD data
var wFB;
var tblFeedbackTable = [];

define(['dojo/_base/declare',
        'jimu/BaseWidget',
        'esri/graphic',
        'esri/geometry/Point',
        'esri/SpatialReference',
        'esri/InfoTemplate',
        'esri/Color',
        'esri/tasks/QueryTask',
        'dijit/registry',
        'dojo/dom',
        'dojo/dom-style',
        'jimu/LayerInfos/LayerInfos',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/layers/FeatureLayer',
        'esri/dijit/FeatureTable',
        'dojo/store/Memory',
        'dijit/Dialog',
        'dijit/form/ComboBox',
        'dijit/form/Button',
        'dijit/form/RadioButton',
        'dijit/form/TextBox',
        'dijit/form/Select',
        'dojo/domReady!'],
function(declare, BaseWidget, Graphic, Point, SpatialReference, InfoTemplate, Color, QueryTask, registry, dom, domStyle, LayerInfos, Query, QueryTask, FeatureLayer, FeatureTable, Memory, Dialog, ComboBox, Button, RadioButton, TextBox, Select) {
    //To create a widget, you need to derive from BaseWidget.
    return declare([BaseWidget], {
        // Custom widget code goes here
        
        baseClass: 'jimu-widget-customwidget',
        
        //this property is set by the framework when widget is loaded.
        name: 'feedback',
        
        //methods to communication with app container:
        
        postCreate: function() {
            this.inherited(arguments);
            console.log('postCreate');
        },
        
        startup: function() {
            this.inherited(arguments);
            console.log('startup');

            wFB = this;

        },
        
        onOpen: function(){
            console.log('onOpen');

            if (curID!='') {
                dom.byId('FEEDBACKTITLE').innerHTML = 'Submit feedback for ' + dGeo.find(o => o.value === curGeo).charttitletext + curID;
                dom.byId('FEEDBACKFORM'   ).style.display = '';
                dom.byId('FEEDBACKHISTORY').style.display = '';
            }
            
            
            //Trying to get to table so that it can be queried.... need to work from here.
            var layerInfosObject = LayerInfos.getInstanceSync();
            for (var j=0, jl=layerInfosObject._tables.length; j<jl; j++) {
                var currentTableInfo = layerInfosObject._tables[j];		
                if (currentTableInfo.title == strFeedbackTable) { //must mach layer title
                    tblFeedbackTable = new FeatureLayer(layerInfosObject._tables[j].url)
                    break;
                }
            }

            wFB._updateFeedbackHistory();

        },
        
        onClose: function(){
            console.log('onClose');
        },
        
        onMinimize: function(){
            console.log('onMinimize');
        },
        
        onMaximize: function(){
            console.log('onMaximize');
        },
        
        onSignIn: function(credential){
            /* jshint unused:false*/
            console.log('onSignIn');
        },
        
        onSignOut: function(){
            console.log('onSignOut');
        },
        
        onPositionChange: function(){
            console.log('onPositionChange');
        },
        
        resize: function(){
            console.log('resize');
        },

        // Receive data from other widgets
        onReceiveData: function(name, widgetId, data, historyData) {
            console.log('onReceiveData');
        
            if (data.message=='update feedback') {
                dom.byId('FEEDBACKTITLE'  ).innerHTML = 'Submit feedback for ' + dGeo.find(o => o.value === curGeo).charttitletext + curID;
                dom.byId('FEEDBACKFORM'   ).style.display = '';
                dom.byId('FEEDBACKHISTORY').style.display = '';

                wFB._updateFeedbackHistory();
            }
            

        },
        
        _submitFeedback: function() {
            var Email = dom.byId("Email");
            var Feedback = dom.byId("feedback");
            var txtConfirmation = dom.byId("txtConfirmation");
            
            var currentdate = new Date(); 

            var attr = {"GeoType":curGeo, "GeoID":curID, "Email":Email.value,"CommentText":Feedback.value,"TimeStampText":currentdate};
            var myRecord = new Graphic(0, 0, attr, 0);
            
            //myNewRecord.attributes = {};
            wFB._updateFeedbackHistory();
            Feedback.value = "";
            
            tblFeedbackTable.applyEdits([myRecord], null, null, function(){console.log('success');}, function(){console.log('error');});

            function delay(time) {
                return new Promise(resolve => setTimeout(resolve, time));
            }
              
            // wait 1/2 second
            delay(500).then(() => wFB._updateFeedbackHistory());
        },

        _updateFeedbackHistory: function() {
            console.log('_updateFeedbackHistory');
            
            var sWhere = "";
            
            var tblquery = new Query();
            
            tblquery.returnGeometry = false;
            
            tblquery.outFields = ["*"];
            
            tblquery.where = "GeoType = '" + curGeo + "' AND GeoID = '" + curID + "'";
            
            //tblquery.orderByFields = [''];

            var tblqueryTask = new QueryTask(tblFeedbackTable.url);

            //execute query
            tblqueryTask.execute(tblquery,showResults);
            
            var parent = this;
            function showResults (results) {
                console.log('begin results display');
                
                var resultCount = results.features.length;
                
                var _commenthistory = '';

                if (resultCount==1) {
                    _plural = '';
                } else {
                    _plural = 's'
                }

                _commenthistory += '<h2>Comment History for ' + dGeo.find(o => o.value === curGeo).charttitletext + curID + '</h2>';

                _commenthistory += '<em>' + resultCount + ' comment' + _plural + ' received</em><br/><br/>';


                for (var i = 0; i < resultCount; i++) {

                    var featureAttributes = results.features[i].attributes;

                    var _email = featureAttributes['Email'];
                    var _commenttext = featureAttributes['CommentText'];
                    var _commentdate = new Date(  featureAttributes['TimeStampText']).toLocaleDateString();

                    var _org = (_email).split('@')[1];

                    _commenthistory += '<strong>Organization:</strong> ' + _org + '&nbsp;&nbsp;&nbsp;&nbsp;<strong>Date:</strong> ' + _commentdate + '<br/><strong>Comment:</strong> ' + _commenttext + '<br/><br/>'; 
                    
                }
                
                dom.byId("FEEDBACKHISTORY").innerHTML = _commenthistory;

            }
        }

    
    //methods to communication between widgets:

    });
});