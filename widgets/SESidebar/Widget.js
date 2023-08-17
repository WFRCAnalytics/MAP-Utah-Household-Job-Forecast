//javascript for controlling WFRC Forecasts
//written by Bill Hereth June 2022

sMode              = "BASIC";
sCityAreas         = 'AEMP PROJECTIONS by CITYAREA'; // layer for outline over TAZ display
sCityAreasOutline  = 'AEMP PROJECTIONS by CITYAREA-Copy'; // layer for outline over TAZ display
// sOtherAreas        = 'AEMP PROJECTIONS by OTHERAREA'; // layer for outline over TAZ display
// sOtherAreasOutline = 'AEMP PROJECTIONS by OTHERAREA-Copy'; // layer for outline over TAZ display
sDistMed           = 'AEMP PROJECTIONS by DISTMED'; // layer for outline over TAZ display
sDistMedOutline    = 'AEMP PROJECTIONS by DISTMED-Copy'; // layer for outline over TAZ display
sDistLrg           = 'AEMP PROJECTIONS by DISTLRG'; // layer for outline over TAZ display
sDistLrgOutline    = 'AEMP PROJECTIONS by DISTLRG-Copy'; // layer for outline over TAZ display
sCounty            = 'AEMP PROJECTIONS by COUNTY'; // layer for outline over TAZ display
sCountyOutline     = 'AEMP PROJECTIONS by COUNTY-Copy'; // layer for outline over TAZ display
// sCenter            = 'AEMP PROJECTIONS by CENTER'; // layer for outline over TAZ display
// sCenterOutline     = 'AEMP PROJECTIONS by CENTER-Copy'; // layer for outline over TAZ display
sMasks             = 'Masks Dissolve';
sREMMBoundary      = 'REMMBoundary';
sCenters           = 'Wasatch Choice 2050 Centers (Vision Map) - WC2050Centers';
sCentersOutline    = 'Wasatch Choice 2050 Centers (Vision Map) - WC2050Centers Outline';
sSAP_BRT           = 'Qualifying BRT Station Buffers quarter mile';
sSAP_TRAX          = 'TRAX or Streetcar Station Buffers half mile';
sSAP_FrontRunner   = 'FrontRunner Station Buffers half mile';

var WIDGETPOOLID_LEGEND = 4;

var curTab = "FORECAST";  // Options: FORECAST, CHANGE, NEWVSOLD
 
dGeo = [ 
  { label: "Traffic Analysis Zones", value: "TAZ"      , defaultLineWidth: 0.4, idfieldname: "CO_TAZID"    , idfieldtype: "number", chartfileprefix: "TAZ"      , charttitletext: "COTAZID "            , legendtitletext: "TAZ"     , roundchartvalues:1, minScaleForLabels: 87804  , compareGeos:[{value:"CITYAREA",label:"City Area"},{value:"DISTMED",label:"Medium District"},{value:"COUNTY",label:"County"},{value:"REGION",label:"Region"}]},
  { label: "City Areas"            , value: "CITYAREA" , defaultLineWidth: 1.5, idfieldname: "CITY_NAME" , idfieldtype: "string", chartfileprefix: "CITY_NAME" , charttitletext: ""                , legendtitletext: "City"    , roundchartvalues:1, minScaleForLabels: 1000000, compareGeos:[                                                                               {value:"COUNTY",label:"County"} ,{value:"REGION",label:"Region"}]},
  { label: "Medium Districts"      , value: "DISTMED"  , defaultLineWidth: 1.5, idfieldname: "DMED_NAME"  , idfieldtype: "string", chartfileprefix: "DMED_NAME"  , charttitletext: "", legendtitletext: "District", roundchartvalues:1, minScaleForLabels: 1000000, compareGeos:[                                                                               {value:"COUNTY",label:"County"} ,{value:"REGION",label:"Region"}]},
  { label: "Large Districts"       , value: "DISTLRG"  , defaultLineWidth: 1.5, idfieldname: "DLRG_NAME"  , idfieldtype: "string", chartfileprefix: "DLRG_NAME"  , charttitletext: "", legendtitletext: "District", roundchartvalues:1, minScaleForLabels: 1000000, compareGeos:[                                                                               {value:"COUNTY",label:"County"}  ,{value:"REGION",label:"Region"}]},
  { label: "Counties"              , value: "COUNTY"   , defaultLineWidth: 2.5, idfieldname: "CO_NAME"  , idfieldtype: "string", chartfileprefix: "CO_NAME"  , charttitletext: ""                , legendtitletext: "County"  , roundchartvalues:1, minScaleForLabels: 2000000, compareGeos:[                                                                                                                  {value:"REGION",label:"Region"}]},
  // { label: "Wasatch Choice Centers", value: "CENTER"   , defaultLineWidth: 5.0, idfieldname: "CenterName", idfieldtype: "string", chartfileprefix: "CenterName", charttitletext: ""                , legendtitletext: "Center"    , roundchartvalues:1, minScaleForLabels: 1000000, compareGeos:[                                                                               {value:"COUNTY",label:"County"}                                       ,{value:"REGION",label:"Region"}]},
  // { label: "Other Areas"           , value: "OTHERAREA", defaultLineWidth: 5.0, idfieldname: "OtherArea", idfieldtype: "string", chartfileprefix: "OtherArea", charttitletext: ""                , legendtitletext: "Area"    , roundchartvalues:1, minScaleForLabels: 1000000, compareGeos:[                                                                               {value:"COUNTY",label:"County"}                                       ,{value:"REGION",label:"Region"}]}
];


var curGeo = 'TAZ';
var curGeoCompare = 'CITYAREA';

var dCat = [
    { label: "Households"      , value: "HH"  , chartcolor:"darkgoldenrod", tabletitle: "House-holds"     , legendtitle:"Number of Households"     },
    { label: "Population"      , value: "POP" , chartcolor:"goldenrod"    , tabletitle: "Popu-lation"     , legendtitle:"Number of People"         },
    { label: "Industrial Jobs" , value: "IND" , chartcolor:"magenta"      , tabletitle: "Industrial Jobs" , legendtitle:"Number of Industrial Jobs"},
    { label: "Office Jobs"     , value: "OTHR", chartcolor:"royalblue"    , tabletitle: "Office Jobs"     , legendtitle:"Number of Office Jobs"    },
    { label: "Retail Jobs"     , value: "RTL" , chartcolor:"maroon"       , tabletitle: "Retail Jobs"     , legendtitle:"Number of Retail Jobs"    },
    { label: "Total Jobs"      , value: "TPCL", chartcolor:"darkslateblue", tabletitle: "Total Jobs"      , legendtitle:"Number of Total Jobs"     },
    { label: "HH+Job Intensity", value: "HJI" , chartcolor:"darkgreen"    , tabletitle: "HH+Job Intensity", legendtitle:"Household+Job Intensity"  }
];

var curCat = 'HH';

var dMet = [
    { label: "Count"  , value: "count", checked: true },
    { label: "Density", value: "density", checked: false}
];

var curMet    = "count";
var curTblVal = "count";

var dAoP = [
    { label: "Absolute Change", value: "absolute", checked: true },
    { label: "Percent Change" , value: "percent" , checked: false}
];

var curAoP = "absolute";

var dRadioButtonGroups = [
    { divname: "MET", contents: dMet},
    { divname: "AOP", contents: dAoP}
];

var dYears = [
    { label: "2019", value: "2019", short: 1},
    { label: "2020", value: "2020", short: 0},
    { label: "2021", value: "2021", short: 0},
    { label: "2022", value: "2022", short: 0},
    { label: "2023", value: "2023", short: 0},
    { label: "2024", value: "2024", short: 0},
    { label: "2025", value: "2025", short: 1},
    { label: "2026", value: "2026", short: 0},
    { label: "2027", value: "2027", short: 0},
    { label: "2028", value: "2028", short: 0},
    { label: "2029", value: "2029", short: 0},
    { label: "2030", value: "2030", short: 1},
    { label: "2031", value: "2031", short: 0},
    { label: "2032", value: "2032", short: 0},
    { label: "2033", value: "2033", short: 0},
    { label: "2034", value: "2034", short: 0},
    { label: "2035", value: "2035", short: 1},
    { label: "2036", value: "2036", short: 0},
    { label: "2037", value: "2037", short: 0},
    { label: "2038", value: "2038", short: 0},
    { label: "2039", value: "2039", short: 0},
    { label: "2040", value: "2040", short: 1},
    { label: "2041", value: "2041", short: 0},
    { label: "2042", value: "2042", short: 0},
    { label: "2043", value: "2043", short: 0},
    { label: "2044", value: "2044", short: 0},
    { label: "2045", value: "2045", short: 1},
    { label: "2046", value: "2046", short: 0},
    { label: "2047", value: "2047", short: 0},
    { label: "2048", value: "2048", short: 0},
    { label: "2049", value: "2049", short: 0},
    { label: "2050", value: "2050", short: 1}
];

var dYearsNewOld = [
    { label: "2020", value: "2020"},
    { label: "2025", value: "2025"},
    { label: "2030", value: "2030"},
    { label: "2035", value: "2035"},
    { label: "2040", value: "2040"},
    { label: "2045", value: "2045"},
    { label: "2050", value: "2050"}
];

var curYear        = "2050";
var curYearFrom    = "2019";
var curYearTo      = "2050";
var curYearNewOld  = "2050";

var lyrDisplay;
var lyrDisplayCompare;
var lyrMasks;
var lyrREMMBoundary;
var lyrCenters;
var lyrCentersOutline;

//ABOUT
var WIDGETPOOLID_ABOUT = 0;

//TAB VARIABLES///

var sCTabOff  = "#bbbbbb";//"#005fa2";
var sCTabOn   = "#90EE90";
var sCTextOn  = "#005fa2";
var sCTextOff = "#ffffff";

var labelClassOn;
var labelClassOff;

var minScaleForLabels = 87804;

//Typical Colors
var sCLightGrey     = "#EEEEEE";
var sCDefaultGrey   = "#CCCCCC";
var sCBlue1         = "#BED2FF";
var sCBlue2         = "#73B2FF";
var sCBlue3         = "#0070FF";
var sCBlue4         = "#005CE6";
var sCBlue5         = "#004DA8";
var sCRed1          = "#FFBEBE";
var sCRed2          = "#FF7F7F";
var sCRed3          = "#E60000";
var sCRed4          = "#730000";
var sCGreen1        = "#54ff00";
var sCGreen2        = "#4ce600";
var sCWhite         = "#ffffff";
var sSelectionColor = "#ffff00";//"#FF69B4"; //Hot Pink

/* Blue to Red Gradiant Ramp - 9 Steps (Bert) */
var sCBertGrad9 = "#Af2944"; //rgb(175,41,68)
var sCBertGrad8 = "#E5272d"; //rgb(229,39,45)
var sCBertGrad7 = "#Eb672d"; //rgb(235,103,45)
var sCBertGrad6 = "#E09d2e"; //rgb(224,157,46)
var sCBertGrad5 = "#8dc348"; //rgb(141,195,72)
var sCBertGrad4 = "#6cb74a"; //rgb(108,183,74)
var sCBertGrad3 = "#00a74e"; //rgb(0,167,78)
var sCBertGrad2 = "#1ba9e6"; //rgb(27,169,230)
var sCBertGrad1 = "#31398a"; //rgb(49,57,138)

//Color Ramps
var aCR_BertGrad9  = new Array(sCBertGrad1,sCBertGrad2,sCBertGrad3,sCBertGrad4,sCBertGrad5,sCBertGrad6,sCBertGrad7,sCBertGrad8,sCBertGrad9);
var aCR_Change7    = new Array(sCBlue3,sCBlue2,sCDefaultGrey,sCRed1,sCRed2,sCRed3,sCRed4);

//Line Widths
var dLineWidth0 = 0.1;
var dLineWidth1 = 0.7;  //narrowest
var dLineWidth2 = 1.7;
var dLineWidth3 = 2.7;
var dLineWidth4 = 3.7;
var dLineWidth5 = 4.7;
var dLineWidth6 = 5.7;
var dLineWidth7 = 6.7;
var dLineWidth8 = 7.7;
var dLineWidth9 = 8.7;  //widest

//Label Properties
var dHaloSize   = 1.5;
var curCountyVol = 35;
var iPixelSelectionTolerance = 5;
curID = ''; // remove var to make global
var curOpacity = 0.65;

// chart
var cChart;
var cChartBasic;
var cmbTableValues;
var cmbYear;
var cmbYearFrom;
var cmbYearTo;
var cmbYearNewOld;
var classbreaks;
var bFirst = true; // to keep track of when first time chart is generated
var taz;

var originalwidth = 0;

var strArcadeCompareFunction = '';

define(['dojo/_base/declare',
    'jimu/BaseWidget',
    'jimu/LayerInfos/LayerInfos',
    'libs/rainbowvis.js',
    'dijit/registry',
    'dojo/dom',
    'dojo/dom-style',
    'dojo/query',
    'dijit/dijit',
    'dijit/Tooltip',
    'dojox/charting/Chart',
    'dojox/charting/themes/Claro',
    'dojox/charting/themes/Julie',
    'dojox/charting/SimpleTheme',
    'dojox/charting/plot2d/Scatter',
    'dojox/charting/plot2d/Lines',
    'dojox/charting/plot2d/Columns',
    'dojox/charting/widget/Legend',
    "dojox/charting/widget/SelectableLegend",
    'dojox/layout/TableContainer',
    'dojox/layout/ScrollPane',
    'dijit/layout/ContentPane',
    'jimu/PanelManager',
    'dijit/form/TextBox',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/layers/FeatureLayer',
    'esri/dijit/FeatureTable',
    'esri/symbols/SimpleFillSymbol',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/symbols/TextSymbol',
    'esri/symbols/Font',
    'esri/layers/LabelClass',
    'esri/InfoTemplate',
    'esri/Color',
    'esri/map',
    'esri/renderers/SimpleRenderer',
    'esri/renderers/UniqueValueRenderer',
    'esri/geometry/Extent',
    'dojo/store/Memory',
    'dojox/charting/StoreSeries',
    'dijit/Dialog',
    'dijit/form/Button',
    'dijit/form/RadioButton',
    'dijit/form/MultiSelect',
    'dojox/form/CheckedMultiSelect',
    'dijit/form/Select',
    'dijit/form/ComboBox',
    'dijit/form/CheckBox',
    'dijit/form/HorizontalSlider',
    'dojo/store/Observable',
    'dojo/cookie',
    'esri/lang',
    'jimu/utils',
    'dojox/charting/axis2d/Default',
    'dojo/domReady!'],
function(declare, BaseWidget, LayerInfos, RainbowVis, registry, dom, domStyle, djQuery, dijit, Tooltip, Chart, Claro, Julie, SimpleTheme, Scatter, Lines, Columns, Legend, SelectableLegend, TableContainer, ScrollPane, ContentPane, PanelManager, TextBox, Query, QueryTask, FeatureLayer, FeatureTable, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, TextSymbol, Font, LabelClass, InfoTemplate, Color, Map, SimpleRenderer, UniqueValueRenderer, Extent, Memory, StoreSeries, Dialog, Button, RadioButton, MutliSelect, CheckedMultiSelect, Select, ComboBox, CheckBox, HorizontalSlider, Observable, cookie, esriLang, jimuUtils) {
  //To create a widget, you need to derive from BaseWidget.
  
  return declare([BaseWidget], {
    // DemoWidget code goes here

//please note that this property is be set by the framework when widget is loaded.
//templateString: template,
baseClass: 'jimu-widget-demo',

postCreate: function() {
  this.inherited(arguments);
  console.log('postCreate');
},
startup: function() {
    console.log('startup');
  
    this.inherited(arguments);
    this.map.setInfoWindowOnClick(false); // turn off info window (popup) when clicking a feature

    //Widen the widget panel to provide more space for charts
    var panel = this.getPanel();
    var pos = panel.position;
    //originalwidth = pos.width;
    pos.width = 450;
    panel.setPosition(pos);
    panel.panelManager.normalizePanel(panel);
    
    var parent = this;
    wSE = this;
    
    this.map.on("zoom-end", function () {  
        wSE._changeZoom();  
    });  
    
    
    //ABOUT WIDGET CONTROL - OPEN ON FIRST USE///////////////////////////////////////////////////////
            
    //var isFirstKey = this._getCookieKey();
    //var isfirst = cookie(isFirstKey);
    //if (isfirst===undefined || isfirst.toString() !== 'false') {
    //  console.log('open about');
    //  var pm = PanelManager.getInstance();
    //  
    //  //Close Widget
    //  //for (var p=0; p < pm.panels.length; p++) {
    //  //  if (pm.panels[p].label == "About") {
    //  //    pm.closePanel(pm.panels[p]);
    //  //  }
    //  //}
    //  
    //  //Open Widget
    //  pm.showPanel(this.appConfig.widgetPool.widgets[WIDGETPOOLID_ABOUT]);
    //  
    //}
    
    var cookieCountyVol = this._getCookieCountyVol();
    var ckCountyVol = cookie(cookieCountyVol);
    if (ckCountyVol !== undefined) {
        curCountyVol = ckCountyVol;
    }

        
    // Populate classbreaks object - for forecast years
    dojo.xhrGet({
        url: "widgets/SESidebar/data/classbreaks.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('classbreaks.json');
            classbreaks = obj;
            wSE._updateDisplay_Step1_CompareGeos();
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
    });
    
    
    // Populate taz ids json
    dojo.xhrGet({
      url: "widgets/SESidebar/data/taz.json",
      handleAs: "json",
      load: function(obj) {
          /* here, obj will already be a JS object deserialized from the JSON response */
          console.log('classbreaks.json');
          taz = obj;
      },
      error: function(err) {
          /* this will execute if the response couldn't be converted to a JS object,
              or if the request was unsuccessful altogether. */
      }
    });
    
    // Populate areas for chart calcs - HOPEFULLY SHORT-TERM FIX
    dojo.xhrGet({
        url: "widgets/SESidebar/data/chart/CITYAREA_DevAcres.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('CITYAREA_DevAcres.json');
            acres_cityarea = obj;
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
    });

    // // Populate areas for chart calcs - HOPEFULLY SHORT-TERM FIX
    // dojo.xhrGet({
    //   url: "widgets/SESidebar/data/chart/CENTER_DevAcres.json",
    //   handleAs: "json",
    //   load: function(obj) {
    //       /* here, obj will already be a JS object deserialized from the JSON response */
    //       console.log('CENTER_DevAcres.json');
    //       acres_center = obj;
    //   },
    //   error: function(err) {
    //       /* this will execute if the response couldn't be converted to a JS object,
    //           or if the request was unsuccessful altogether. */
    //   }
    // }); 
    
                
    // // Populate areas for chart calcs - HOPEFULLY SHORT-TERM FIX
    // dojo.xhrGet({
    //   url: "widgets/SESidebar/data/chart/OTHERAREA_DevAcres.json",
    //   handleAs: "json",
    //   load: function(obj) {
    //       /* here, obj will already be a JS object deserialized from the JSON response */
    //       console.log('OTHERAREA_DevAcres.json');
    //       acres_otherarea = obj;
    //   },
    //   error: function(err) {
    //       /* this will execute if the response couldn't be converted to a JS object,
    //           or if the request was unsuccessful altogether. */
    //   }
    // }); 

    // Populate areas for chart calcs - HOPEFULLY SHORT-TERM FIX
    dojo.xhrGet({
        url: "widgets/SESidebar/data/chart/DISTMED_DevAcres.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('DISTMED_DevAcres.json');
            acres_distmed = obj;
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
    });

    // Populate areas for chart calcs - HOPEFULLY SHORT-TERM FIX
    dojo.xhrGet({
      url: "widgets/SESidebar/data/chart/DISTLRG_DevAcres.json",
      handleAs: "json",
      load: function(obj) {
          /* here, obj will already be a JS object deserialized from the JSON response */
          console.log('DISTLRG_DevAcres.json');
          acres_distmed = obj;
      },
      error: function(err) {
          /* this will execute if the response couldn't be converted to a JS object,
              or if the request was unsuccessful altogether. */
      }
  });
    
    // Populate areas for chart calcs - HOPEFULLY SHORT-TERM FIX
    dojo.xhrGet({
        url: "widgets/SESidebar/data/chart/TAZ_DevAcres.json",
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log('TAZ_DevAcres.json');
            acres_taz = obj;
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
    });
    
    // Populate areas for chart calcs - HOPEFULLY SHORT-TERM FIX
    dojo.xhrGet({
      url: "widgets/SESidebar/data/chart/COUNTY_DevAcres.json",
      handleAs: "json",
      load: function(obj) {
          /* here, obj will already be a JS object deserialized from the JSON response */
          console.log('COUNTY_DevAcres.json');
          acres_county = obj;
      },
      error: function(err) {
          /* this will execute if the response couldn't be converted to a JS object,
              or if the request was unsuccessful altogether. */
      }
    });

    // Table value type
    cmbTableValues = new Select({
        id: "selectValue",
        name: "selectValueName",
        options: dMet,
        onChange: function(){
            curTblVal = this.value;
            wSE._getChartData();
        }
    }, "cmbTableValues");
    cmbTableValues.startup();
    cmbTableValues.set("value",curTblVal);

    // Setup Geos
    var _cmbGeos = new Select({
        id: "selectGeo",
        name: "selectGeoName",
        options: dGeo,
        onChange: function(){
            curGeo = this.value;
            lyrDisplay.clearSelection();
            wSE._closeFeedback();
            wSE.map.infoWindow.clearFeatures();
            wSE._updateDisplay_Step1_CompareGeos();
            _cmbGeoCompare.set("options",dGeo.find(o => o.value === curGeo).compareGeos);
            curGeoCompare = dGeo.find(o => o.value === curGeo).compareGeos[0].value;
            _cmbGeoCompare.set("value",curGeoCompare);
        }
    }, "cmbGeo");
    _cmbGeos.startup();
    _cmbGeos.set("value",curGeo);

    // Setup GeoCompare
    var _cmbGeoCompare = new Select({
        id: "selectGeoCompare",
        name: "selectGeoCompareName",
        options: dGeo.find(o => o.value === curGeo).compareGeos, // get current compare geos options
        onChange: function(){
            curGeoCompare = this.value;
            //lyrDisplay.clearSelection();
            //wSE._closeFeedback();
            //wSE.map.infoWindow.clearFeatures();
            wSE._updateDisplay_Step1_CompareGeos();
        }
    }, "cmbGeoCompare");
    _cmbGeoCompare.startup();
    _cmbGeoCompare.set("value",curGeoCompare);
  
    // Setup Categories
    var _cmbCats = new Select({
        id: "selectCat",
        name: "selectCatName",
        options: dCat,
        onChange: function(){
            curCat = this.value;
            wSE._updateDisplay_Step1_CompareGeos();
            wSE._getChartData();
        }
    }, "cmbCat");
    _cmbCats.startup();
    _cmbCats.set("value",curCat);

    
    // Setup Radio Button Groups

    for (rbg in dRadioButtonGroups) {

        var sDivName = dRadioButtonGroups[rbg].divname;

        var _divRBDiv = dom.byId(sDivName);
        
        for (d in dRadioButtonGroups[rbg].contents) {

            var sValue = dRadioButtonGroups[rbg].contents[d].value;
            var sLabel = dRadioButtonGroups[rbg].contents[d].label;
        
            // define if this is the radio button that should be selected
            if (dRadioButtonGroups[rbg].contents[d].checked == true) {
                var bChecked = true;
            } else {
                var bChecked = false;
            }
            
            // radio button id
            _rbID = "rb_" + sDivName + "_" + sValue; // value for future lookup will be after 3rd item in '_' list
    
            // radio button object
            var _rbRB = new RadioButton({ name:sDivName, label:sLabel, id:_rbID, value: sValue, checked: bChecked});
            _rbRB.startup();
            _rbRB.placeAt(_divRBDiv);
    
            // radio button label
            var _lblRB = dojo.create('label', {
            innerHTML: sLabel,
            for: _rbID,
            id: _rbID + '_label'
            }, _divRBDiv);
            
            // place radio button
            dojo.place("<br/>", _divRBDiv);
        
            // Radio Buttons Change Event
            dom.byId(_rbID).onchange = function(isChecked) {
                console.log(sDivName + "radio button onchange");
                if(isChecked) {
                    // check which group radio button is in and assign cur value accordingly
                    switch(this.name) {
                        case 'MET'    :
                            curMet = (this.id).split('_')[2];
                            curTblVal = curMet;
                            cmbTableValues.set("value",curTblVal);
                            wSE._getChartData();
                            break; // get id as last of 3 items (location 2) in '_' list
                        case 'AOP'    :
                            curAoP = (this.id).split('_')[2];
                            break; // get id as last of 3 items (location 2) in '_' list
                    }
                    wSE._updateDisplay_Step1_CompareGeos();
                }
            }
        }
    }

    // Setup Years Selections
    cmbYear = new Select({
        id: "selectYear",
        name: "selectYearName",
        options: dYears,
        onChange: function(){
            curYear = this.value;
            wSE._updateDisplay_Step1_CompareGeos();
            wSE._getChartData();
        }
    }, "cmbYear");
    cmbYear.startup();
    cmbYear.set("value",curYear);

    cmbYearFrom = new Select({
        id: "selectYearFrom",
        name: "selectYearFromName",
        options: dYears,
        onChange: function(){
            curYearFrom = this.value;
            wSE._updateDisplay_Step1_CompareGeos();
            wSE._getChartData();
        }
    }, "cmbYearFrom");
    cmbYearFrom.startup();
    cmbYearFrom.set("value",curYearFrom);

    cmbYearTo = new Select({
        id: "selectYearTo",
        name: "selectYearToName",
        options: dYears,
        onChange: function(){
            curYearTo = this.value;
            wSE._updateDisplay_Step1_CompareGeos();
            wSE._getChartData();
        }
    }, "cmbYearTo");
    cmbYearTo.startup();
    cmbYearTo.set("value",curYearTo);

    cmbYearNewOld = new Select({
        id: "selectYearNewOld",
        name: "selectYearNewOldName",
        options: dYearsNewOld,
        onChange: function(){
            curYearNewOld = this.value;
            wSE._updateDisplay_Step1_CompareGeos();
            wSE._getChartData();
        }
    }, "cmbYearNewOld");
    cmbYearNewOld.startup();
    cmbYearNewOld.set("value",curYearNewOld);

    //SETUP MAP CLICK EVENT
    
    wSE.map.on('click', selectFeatures);    
    
  
    function pointToExtent(map, point, toleranceInPixel) {  
        var pixelWidth = wSE.map.extent.getWidth() / wSE.map.width;  
        var toleranceInMapCoords = toleranceInPixel * pixelWidth;  
        return new Extent(point.x - toleranceInMapCoords,  
            point.y - toleranceInMapCoords,  
            point.x + toleranceInMapCoords,  
            point.y + toleranceInMapCoords,  
            wSE.map.spatialReference);  
    }
  
    //Setup Function for Selecting Features

    function selectFeatures(evt) {
            
        var _clickableLayer            = lyrDisplay;
        var _clickableLayerIDFieldName = dGeo.find(o => o.value === curGeo).idfieldname;
        var _clickableLayerIDFieldType = dGeo.find(o => o.value === curGeo).idfieldtype;

        var _query = new Query();
        _query.geometry = pointToExtent(map, evt.mapPoint, iPixelSelectionTolerance);
        _query.returnGeometry = false;
        _query.outFields = ["*"];

        var _queryTask = new QueryTask(_clickableLayer.url);
        
        //Clear Selection
        _clickableLayer.clearSelection();
        wSE.map.infoWindow.clearFeatures();
        
        //execute query
        _queryTask.execute(_query,showResults);
        
        //search results
        function showResults(results) {
            console.log('showResults');
            var resultCount = results.features.length;
            //only use first result
            if (resultCount>=1) {

                // clear, since find TAZ uses graphics
                wSE.map.graphics.clear();

                var featureAttributes = results.features[0].attributes;
                curID = featureAttributes[_clickableLayerIDFieldName];

                if (curGeo=='TAZ') {
                    curCOTAZID = featureAttributes[_clickableLayerIDFieldName];
                }

                // send ID info to feedback widget
                wSE.publishData({message: "update feedback"});

                var _querylayer = new Query();  
                _querylayer.returnGeometry = false;
                switch (_clickableLayerIDFieldType) {
                    case ("string"):
                        _querylayer.where = _clickableLayerIDFieldName + "='" + curID + "'";
                        break;
                    case ("number"):
                        _querylayer.where = _clickableLayerIDFieldName + "=" + curID;
                        break;
                }
                
                _querylayer.outFields = ["*"];
                var _selectFeature = _clickableLayer.selectFeatures(_querylayer, FeatureLayer.SELECTION_NEW);
                //wSE.map.infoWindow.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(sSelectionColor), 3);
                wSE.map.infoWindow.fillSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255,255,0]), 3), new Color([255,255,0,0.25]));
                wSE.map.infoWindow.setFeatures([_selectFeature]);

                //Update chart
                wSE._getChartData();
            }
        }
    }
    // Create the chart within it's "holding" node
    cChart = new Chart("CHARTSE");
    cChart.setTheme(Claro);
    // Add the only/default plot 
    cChart.addPlot("default", {
        type: "Lines"//,
        //gap: 10
    });

    cChartBasic = new Chart("CHARTSEBASIC");
    cChartBasic.setTheme(Claro);
    // Add the only/default plot 
    cChartBasic.addPlot("default", {
        type: "Lines"//,
        //gap: 10
    });
    
    // Add axes
    cChart.addAxis("x", { microTickStep: 1, minorTickStep: 1, majorTickStep: 1,
                          font: "normal normal normal 8pt Verdana",
                          labels: [
                                      {value:"2020", text:"2020"},
                                      {value:"2025", text:"2025"},
                                      {value:"2030", text:"2030"},
                                      {value:"2035", text:"2035"},
                                      {value:"2040", text:"2040"},
                                      {value:"2045", text:"2045"},
                                      {value:"2050", text:"2050"},
                                  ],
                          title: "", //Day of Week
                          titleOrientation: "away",
                          titleFont: "normal normal normal 10pt Verdana",
                          titleGap: 10,
                          majorTickStep: 5,
                          minorLabels: false
                        }
    );
    cChart.addAxis("y", {   vertical: true,
                            fixLower: "major",
                            fixUpper: "minor",
                            min: 0,
                            minorLabels: false,
                            majorLabels: true,
                            //majorTickStep: 500,
                            //minorTickStep: 100,
                            minorTicks: true,
                            titleGap: 100,
                            majorTick: {color: "grey", length: 10},
                            minorTick: {stroke: "grey", length: 5}
                        }
      );

    // Add axes
    cChartBasic.addAxis("x", { microTickStep: 1, minorTickStep: 1, majorTickStep: 1,
                               font: "normal normal normal 8pt Verdana",
                               labels: [
                                           {value:"2020", text:"2020"},
                                           {value:"2025", text:"2025"},
                                           {value:"2030", text:"2030"},
                                           {value:"2035", text:"2035"},
                                           {value:"2040", text:"2040"},
                                           {value:"2045", text:"2045"},
                                           {value:"2050", text:"2050"},
                                       ],
                               title: "", //Day of Week
                               titleOrientation: "away",
                               titleFont: "normal normal normal 10pt Verdana",
                               titleGap: 10,
                               majorTickStep: 5,
                               minorLabels: false
                              }
    );
    cChartBasic.addAxis("y", {  vertical: true,
                                fixLower: "major",
                                fixUpper: "minor",
                                min: 0,
                                minorLabels: false,
                                majorLabels: true,
                                //majorTickStep: 500,
                                //minorTickStep: 100,
                                minorTicks: true,
                                titleGap: 100,
                                majorTick: {color: "grey", length: 10},
                                minorTick: {stroke: "grey", length: 5}
                              }
    );

    // for new numbers
    for (c in dCat) {
        cChart     .addSeries(dCat[c].label, [{x: 0, y: 0}, {x: 1, y: 0}], {stroke: {color: new Color(dCat[c].chartcolor), width: 3}, fill: new Color(dCat[c].chartcolor)})
        cChartBasic.addSeries(dCat[c].label, [{x: 0, y: 0}, {x: 1, y: 0}], {stroke: {color: new Color(dCat[c].chartcolor), width: 3}, fill: new Color(dCat[c].chartcolor)})
    }

    // // for old numbers
    // for (c in dCat) {
    //     cChart.addSeries(dCat[c].label + " - 2019 RTP", [{x: 0, y: 0}, {x: 1, y: 0}], {stroke: {color: new Color(dCat[c].chartcolor), width: 1}, fill: new Color(dCat[c].chartcolor)})
    // }

    // Create the legend
    //lLegendOne = new Legend({ chart: cChart }, "legendOne");
    lLegend      = new dojox.charting.widget.SelectableLegend({chart: cChart     , outline: true, horizontal: false},"LEGENDSE"     );
    lLegendBasic = new dojox.charting.widget.SelectableLegend({chart: cChartBasic, outline: true, horizontal: false},"LEGENDSEBASIC");

    cChart     .render();
    cChartBasic.render();

    // hide after chart rendered so that chart is to the correct width
    dom.byId('DETAILS').style.display = 'none';

    // create horizontal slider
    var horizSlider = new HorizontalSlider({
        minimum: 0,
        maximum: 1,
        discreteValues: 21,
        value: 1-curOpacity,
        intermediateChanges: true,
        onChange: function(){
            curOpacity = 1-this.value;
            console.log('horizSlider onChange');
            lyrDisplay.setOpacity(curOpacity);
            dom.byId("OPACITY").innerHTML = ((1-curOpacity)*100).toFixed(0) + "%";
        }
    }, "HORIZSLIDER");

    // Start up the widget
    horizSlider.startup();

    // Get the input field
    var input = dom.byId("TAZInput");

    // Execute a function when the user presses a key on the keyboard
    input.addEventListener("keypress", function(event) {
      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        //event.preventDefault();
        // Trigger the button element with a click
        dom.byId("tazfindbutton").click();
      }
    });

},

_updateDisplay_Step1_CompareGeos: function() {

    if (dom.byId('chkCompareGeo').checked==true) { // if checked get data from compare geos
        
        // query current compare geography and great data lookup

        // region is hard coded in as total of counties
        if (curGeoCompare=='REGION') {
            _sLayerNameCompare = curCat + ' PROJECTIONS by COUNTY';
            var _compareLayerIDFieldName = dGeo.find(o => o.value === 'COUNTY').idfieldname;
            var _compareLayerIDFieldType = dGeo.find(o => o.value === 'COUNTY').idfieldtype;
        } else {
            _sLayerNameCompare = curCat + ' PROJECTIONS by ' + curGeoCompare;
            var _compareLayerIDFieldName = dGeo.find(o => o.value === curGeoCompare).idfieldname;
            var _compareLayerIDFieldType = dGeo.find(o => o.value === curGeoCompare).idfieldtype;
        }
        

        // Initialize Layers
        var layerInfosObject = LayerInfos.getInstanceSync();
        for (var j=0, jl=layerInfosObject._layerInfos.length; j<jl; j++) {
            var currentLayerInfo = layerInfosObject._layerInfos[j];
            if (currentLayerInfo.title == _sLayerNameCompare) { //must mach layer title
                lyrDisplayCompare = layerInfosObject._layerInfos[j].layerObject;
            }
        }

        queryTask = new esri.tasks.QueryTask(lyrDisplayCompare.url);
        
        query = new esri.tasks.Query();
        query.returnGeometry = true;
        query.outFields = ["*"];

        // RETURN ALL
        query.where = '1=1'
        //query.where = "TAZID = " + _findTAZID;

        queryTask.execute(query, showResults);
        
        function showResults(featureSet) {

            strArcadeCompareFunction = " function getCompareValue(geoID) { ";

            var _regionScore = 0;
            var _regionDevAcres = 0;

            //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.
            for (var i=0;i<featureSet.features.length;i++) {
                // feature attributes
                var _fA = featureSet.features[i].attributes;

                var _compareGeoID = _fA[_compareLayerIDFieldName];

                // mirror expression creation of _updateDisplay()

                var _absoluteorpercent = curAoP;

                var _devacres = _fA['DEVACRES'];

                // get values and expression depending on tab
                if (curTab=='FORECAST') {
                    var _score    = _fA['N_' + curYear ];
                    _absoluteorpercent = 'absolute'; // only absolute
                } else if (curTab=='CHANGE') {
                    if (_absoluteorpercent=='absolute') {
                        var _score    =  _fA['N_' + curYearTo] - _fA['N_' + curYearFrom];
                    } else if(_absoluteorpercent=='percent') {
                        var _score    =  (_fA['N_' + curYearTo] - _fA['N_' + curYearFrom]) / _fA['N_' + curYearFrom];
                    }
                } else if (curTab=='NEWVSOLD') {
                    if (_absoluteorpercent=='absolute') {
                        var _score    =  _fA['N_' + curYearNewOld] - _fA['O_' + curYearNewOld];
                    } else if(_absoluteorpercent=='percent') {
                        var _score    =  (_fA['N_' + curYearNewOld] - _fA['O_' + curYearNewOld]) / _fA['O_' + curYearNewOld];
                    }
                }

                // modify expression if density
                if (curMet=='density') {
                    var _finalValue = _score / _devacres; // use density if density
                } else {
                    var _finalValue = _score;
                }

                _regionScore    += _score;
                _regionDevAcres += _devacres;

                if (_compareLayerIDFieldType=='number') {
                    var _expressionGeoID = _compareGeoID;
                } else if (_compareLayerIDFieldType=='string') {
                    var _expressionGeoID = "'" + _compareGeoID + "'";
                }
                
                // append new if expression for each value just to make coding easier than doing if and else
                strArcadeCompareFunction += "if (geoID==" + _expressionGeoID + ") { return " + _finalValue + "; } "
            }
            if (curMet=='density') {
                var _regionValue = _regionScore / _regionDevAcres;
            } else {
                var _regionValue = _regionScore;
            }
            strArcadeCompareFunction += " \
            if (geoID=='REGION') { return " + _regionValue + "; } \
            return -999999; \
            }"; // return -999999 if no value
            // proceed to next step... REPLACE WITH ASYNCHRONOUS FUNCTIONS
            wSE._updateDisplay_Step2_MainLayer();
        }
    } else { // if not checked, go straight to next step... REPLACE WITH ASYNCHRONOUS FUNCTIONS
        strArcadeCompareFunction = ""; // if no compare leave blank
        wSE._updateDisplay_Step2_MainLayer();
    }

},

_updateDisplay_Step2_MainLayer: function() {

    console.log('_updateDisplay');

    _sLayerName = curCat + ' PROJECTIONS by ' + curGeo;

    console.log('Update display for layer ' + _sLayerName);

    if (sMode=="ADVANCED" && curGeo=='TAZ') {
      dom.byId('TAZLOOKUP').style.display = ''    ;
    } else {
      dom.byId('TAZLOOKUP').style.display = 'none';
    }

    // Initialize Layers
    var layerInfosObject = LayerInfos.getInstanceSync();
    for (var j=0, jl=layerInfosObject._layerInfos.length; j<jl; j++) {
        var currentLayerInfo = layerInfosObject._layerInfos[j];
        if (currentLayerInfo.title == _sLayerName) { //must mach layer title
            lyrDisplay = layerInfosObject._layerInfos[j].layerObject;
        
        } else if (currentLayerInfo.title == sCityAreas) { //must mach layer title
            var _lyrCityAreas = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sCityAreasOutline) { //must mach layer title
            var _lyrCityAreasOutline = layerInfosObject._layerInfos[j].layerObject;

        // } else if (currentLayerInfo.title == sCenter) { //must mach layer title
        //     var _lyrCenter = layerInfosObject._layerInfos[j].layerObject;
        // } else if (currentLayerInfo.title == sCenterOutline) { //must mach layer title
        //     var _lyrCenterOutline = layerInfosObject._layerInfos[j].layerObject;

        // } else if (currentLayerInfo.title == sOtherAreas) { //must mach layer title
        //     var _lyrOtherAreas = layerInfosObject._layerInfos[j].layerObject;
        // } else if (currentLayerInfo.title == sOtherAreasOutline) { //must mach layer title
        //     var _lyrOtherAreasOutline = layerInfosObject._layerInfos[j].layerObject;

        } else if (currentLayerInfo.title == sDistMed) { //must mach layer title
            var _lyrDistMed = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sDistMedOutline) { //must mach layer title
            var _lyrDistMedOutline = layerInfosObject._layerInfos[j].layerObject;


        } else if (currentLayerInfo.title == sDistLrg) { //must mach layer title
            var _lyrDistLrg = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sDistLrgOutline) { //must mach layer title
            var _lyrDistLrgOutline = layerInfosObject._layerInfos[j].layerObject;


        } else if (currentLayerInfo.title == sCounty) { //must mach layer title
            var _lyrCounty = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sCountyOutline) { //must mach layer title
            var _lyrCountyOutline = layerInfosObject._layerInfos[j].layerObject;
        
        } else if (currentLayerInfo.title == sMasks) {
            lyrMasks = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sCenters) {
            lyrCenters = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sCentersOutline) {
            lyrCentersOutline = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sSAP_BRT) {
            lyrSAP_BRT = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sSAP_TRAX) {
            lyrSAP_TRAX = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sSAP_FrontRunner) {
            lyrSAP_FrontRunner = layerInfosObject._layerInfos[j].layerObject;
        } else if (currentLayerInfo.title == sREMMBoundary) {
            lyrREMMBoundary = layerInfosObject._layerInfos[j].layerObject;
        } else {
            layerInfosObject._layerInfos[j].layerObject.hide(); // hide all other layers
        }
    }

    var _checkedCompareGeos = dom.byId('chkCompareGeo').checked;

    // get class breaks
    if (typeof classbreaks !== 'undefined') {

        // get line width based on Geo
        _dLineWidth = dGeo.find(o => o.value === curGeo).defaultLineWidth;
        var defaultLineSE = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex(sCLightGrey), _dLineWidth);

        // get values and expression depending on tab
        if (curTab=='FORECAST') {
            var _forecastorchange = 'forecast';
            var _scoreExp    = '$feature["N_' + curYear + '"]';
            var _scoreExpDen = '$feature["N_' + curYear + '"] / $feature.DEVACRES';
            var _absoluteorpercent = 'absolute'; // only absolute
            if (curMet=='count') {
                var _sLegendTitle = dCat.find(o => o.value === curCat).legendtitle + ' per ' + dGeo.find(o => o.value === curGeo).legendtitletext + ' in ' + curYear;
            } else if (curMet=='density') {
                var _sLegendTitle = dCat.find(o => o.value === curCat).legendtitle + ' per ' + dGeo.find(o => o.value === curGeo).legendtitletext + '<br/>per Developable Acre in ' + curYear;
            }
        } else if (curTab=='CHANGE') {
            var _forecastorchange = 'change';
            var _scoreExp    =  '$feature["N_' + curYearTo + '"] - $feature["N_' + curYearFrom + '"]';
            var _scoreExpDen = '($feature["N_' + curYearTo + '"] / $feature.DEVACRES) - ($feature["N_' + curYearFrom + '"] / $feature.DEVACRES)'
            var _absoluteorpercent = curAoP;
            if (curMet=='count') { // legend title
                var _sLegendTitle = 'Change in ' + dCat.find(o => o.value === curCat).legendtitle + ' per ' + dGeo.find(o => o.value === curGeo).legendtitletext + '<br/> from ' + curYearFrom + ' to ' + curYearTo;
            } else if (curMet=='density') {
                var _sLegendTitle = 'Change in ' + dCat.find(o => o.value === curCat).legendtitle + ' per ' + dGeo.find(o => o.value === curGeo).legendtitletext + '<br/>per Developable Acre from ' + curYearFrom + ' to ' + curYearTo;
            }
        } else if (curTab=='NEWVSOLD') {
            var _forecastorchange = 'change';
            var _scoreExp    =  '$feature["N_' + curYearNewOld + '"] - $feature["O_' + curYearNewOld + '"]';
            var _scoreExpDen = '($feature["N_' + curYearNewOld + '"] / $feature.DEVACRES) - ($feature["O_' + curYearNewOld + '"] / $feature.DEVACRES)'
            var _absoluteorpercent = curAoP;
            if (curMet=='count') { // legend title
                var _sLegendTitle = 'Change in ' + dCat.find(o => o.value === curCat).legendtitle + ' per ' + dGeo.find(o => o.value === curGeo).legendtitletext + '<br/>in ' + curYearNewOld + ' (New vs 2019 RTP)';
            } else if (curMet=='density') {
                var _sLegendTitle = 'Change in ' + dCat.find(o => o.value === curCat).legendtitle + ' per ' + dGeo.find(o => o.value === curGeo).legendtitletext + '<br/>per Developable Acre in ' + curYearNewOld + ' (New vs 2019 RTP)';
            }
        }

        // modify expression if percent
        if (_absoluteorpercent=='percent') {
            _scoreExp    = '(' + _scoreExp    + ') / ' + _scoreExp   .split("-")[1]  // add last item as denominator
            _scoreExpDen = '(' + _scoreExpDen + ') / ' + _scoreExpDen.split("-")[1]  // add last item as denominator
        }

        // modify expression if density
        if (curMet=='density') {
            _scoreExp = _scoreExpDen; // use density if density
            dom.byId('COMPARELABEL').innerHTML = 'Show as Relative to:';
        } else {
            dom.byId('COMPARELABEL').innerHTML = 'Show as Percent of:';
        }

        // add compare geo function

        if (strArcadeCompareFunction.length>0) {
          var _idfieldname = "";

          if (curGeoCompare=='REGION') {
              var _arcadeExp = strArcadeCompareFunction + "\
                  if (getCompareValue('REGION')==-999999) { \
                    var displayvalue = -999999;\
                  } else {\
                    var displayvalue = (" + _scoreExp + ") / getCompareValue('REGION');\
                  }";
          }
          else {
              var _arcadeExp = strArcadeCompareFunction + "\
                  if (getCompareValue($feature['" + dGeo.find(o => o.value === curGeoCompare).idfieldname + "'])==-999999) { \
                    var displayvalue = -999999;\
                  } else {\
                    var displayvalue = (" + _scoreExp + ") / getCompareValue($feature['" + dGeo.find(o => o.value === curGeoCompare).idfieldname + "']);\
                  }";
          }

          switch (curTab) {
              case ('FORECAST'):
                  _forecastorchange = 'compareforecast';
                  break;
              case ('CHANGE'):
              case ('NEWVSOLD'):
                  _forecastorchange = 'comparechange';
                  break;
          }
          // all comparison will use the percent
          _absoluteorpercent = 'percent';
        } else {
          var _arcadeExp = "var displayvalue = " + _scoreExp + "; ";
        }

        // find appropriate object in JSON file
        var _classbreaks = classbreaks.filter( function(classbreaks){return (classbreaks.geography==curGeo &&
                                                                             classbreaks.categoryCode==curCat &&
                                                                             classbreaks.metric==curMet &&
                                                                             classbreaks.forecastorchange==_forecastorchange &&
                                                                             classbreaks.absoluteorpercent==_absoluteorpercent);}
                                                                             )[0];

        if (typeof _classbreaks == 'undefined') {

            lyrDisplay.hide();

        } else {
          
            // initialize variables
            var _aBreaks          = [];
            var _iBreakMin        = 0;
            var _iBreakMax        = 0;
            var _sColor           = '';
            var _sLabel           = '';
            var _sLegend          = '';
            var _sLegendLabelLow  = '';
            var _sLegendLabelHigh = '';

            var rainbow = new Rainbow(); 
            rainbow.setNumberRange(1, _classbreaks.numClasses);
            rainbow.setSpectrum(_classbreaks.beginColor, _classbreaks.endColor);
            
            // loop through all classes, go backward to construct expression correctly
            for (var l=_classbreaks.numClasses-1; l>=0; l--) {
                
                // get names of class fields
                _sClassFieldFrom = "classMin" + l.toString();
                _iBreakMin = _classbreaks[_sClassFieldFrom];

                if (l<_classbreaks.numClasses-1) { // Max of class is min of nex class
                    _sClassFieldTo   = "classMin" + (l+1).toString();
                    _iBreakMax = _classbreaks[_sClassFieldTo];
                }
                
                // setup value expression
                _class = "class_" + String(l)
                if (l==_classbreaks.numClasses-1) { // last class 
                    var _codeblock =  _arcadeExp + "\
                                        if      (displayvalue>=" + String(_iBreakMin) + ") { return '" + _class + "'; }"
                } else if (l>0 && l<_classbreaks.numClasses-1) { // middle classes
                        _codeblock += " else if (displayvalue>=" + String(_iBreakMin) + ") { return '" + _class + "'; }"
                } else if (l==0) { // first class
                        _codeblock += " else                                               { return '" + _class + "'; }"
                }
                var temp = _iBreakMin.toPrecision(4);

                if (_absoluteorpercent=='absolute') {
                    // format as number with commas for thousands separator
                    var sBreakMin = this._NumberWithCommas(_iBreakMin);
                    var sBreakMax = this._NumberWithCommas(_iBreakMax);
                } else if (_absoluteorpercent=='percent') {
                    // format as percent
                    var sBreakMin = ((_iBreakMin.toPrecision(4))*100) + "%";
                    var sBreakMax = ((_iBreakMax.toPrecision(4))*100) + "%";
                }

                // set label for classes base on begin and end ranges

                // add 'increase' to legend labels for change and new vs old
                if (curTab=='CHANGE' || curTab=='NEWVSOLD') {
                    var _increase = ' increase';
                } else if (curTab=='FORECAST') {
                    var _increase = '';
                }
                if (l==0) { // last class
                    if (_iBreakMin==0) {
                        _sLabel = 'Zero ' + _classbreaks.units;
                        _sLegendLabelLow = 'zero';
                    }
                    else if (_iBreakMax<=1) {
                        _sLabel = 'Decline in ' + _classbreaks.units;
                        _sLegendLabelLow = 'decline';
                    } else {
                        _sLabel = 'Less than ' + sBreakMax + ' ' + _classbreaks.units;
                        _sLegendLabelLow = 'lowest';
                    }
                } else if (l==_classbreaks.numClasses-1) { // last class
                    _sLabel = 'More than ' + sBreakMin + ' ' + _classbreaks.units + _increase;
                    var _sLegendLabelHigh = '&gt;' + sBreakMin + _increase;
                } else {
                    _sLabel = sBreakMin + ' to '
                     + sBreakMax + ' ' + _classbreaks.units + _increase;
                }
                
                
                // use rainbow to get color ramp
                _sColor = "#" + rainbow.colourAt(l+1);

                // add break to array
                _aBreaks.push({value: _class, symbol: new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, defaultLineSE, Color.fromHex(_sColor)), label: _sLabel});

                // short legend bar with equal width for each class
                _sLegend = '<td width="' + 100 / _classbreaks.numClasses + '%" style="background-color:' + _sColor + '">&nbsp;</td>' + _sLegend; // add text to begining of string
            }
            

            // Setup short legend bar
            var _sLegendTable ='<table width="100%"> \
                                    <tr> \
                                        <td colspan="' + _classbreaks.numClasses + '" align="center"> \
                                            <div id="LEGENDNAME" class="thick thicker">' + _sLegendTitle + '</div> \
                                        </td> \
                                    </tr> \
                                    <tr> \
                                        ' +_sLegend + ' \
                                    </tr> \
                                    <tr> \
                                        <td colspan="2"> \
                                            <small><strong>' + _sLegendLabelLow + '</strong></small> \
                                        </td> \
                                        <td colspan="' + String(_classbreaks.numClasses - 4) + '" align="center"> \
                                          <div id="SHOWHIDELEGEND" class="pointertext"><small>Show Large Legend<\small></div> \
                                        </td> \
                                        <td colspan="2" align="right"> \
                                            <small><strong>' + _sLegendLabelHigh + '</strong></small> \
                                        </td> \
                                    </tr> \
                                </table>';
            dom.byId('LAYERLEGEND').innerHTML = _sLegendTable;

            // set up layer rendering
            var _renderer = new UniqueValueRenderer({
                type: "unique-value",
                valueExpression: _codeblock,
                uniqueValueInfos: _aBreaks
            });
            

            // DO NOT USE THIS METHODOLOGY! CRASHES! go backwards so that lower numbers first
            //for (var j=_aBreaks.length-1;j>=0;j--) {
            //    _renderer.addValue(_aBreaks[j]);
            //}
            
            lyrDisplay.setRenderer(_renderer);
            lyrDisplay.refresh();
            lyrDisplay.setOpacity(curOpacity);
            lyrDisplay.show();
            dom.byId('OPACITY').innerHTML = ((1-curOpacity)*100).toFixed(0) + "%";


            // setup labels
            _exp = "";

            // format labels as percent or numeric with commas
            if (curAoP=='percent') {
                _exp = "Text(" + _scoreExp + ",'#.0%')";
            } else if (curAoP=='absolute') {
                if (curMet=='count') {
                    _exp = "Text(" + _scoreExp + ",'#,###,##0')";
                } else if (curMet='density') {
                    _exp = "Text(" + _scoreExp + ",'#.00')";
                }
            }

            if (strArcadeCompareFunction.length>0) {
                
                switch (curTab) {
                    case ('FORECAST'):
                        if (curMet=='count') {
                            _exp = _arcadeExp + " if (displayvalue==-999999) { return ''; } else if (displayvalue==0) { return '--'; } else if (displayvalue<0.005) { return '<0.1%'; } else if (displayvalue>=0.005) { return Text(displayvalue,'#.0%'); } else { return ''; }";
                        } else if (curMet='density') {
                            _exp = _arcadeExp + " if (displayvalue==-999999) { return ''; } else if (displayvalue==0) { return '--'; } else if (displayvalue<0.05 ) { return '<0.1x'; } else if (displayvalue>=0.05 ) { return Text(displayvalue,'#.0x'); } else { return ''; }";
                        }
                        break;
                    case ('CHANGE'):
                    case ('NEWVSOLD'):
                        if (curMet=='count') {
                            _exp = _arcadeExp + " return Text(displayvalue,'#.0%');"
                        } else if (curMet='density') {
                            _exp = _arcadeExp + " return Text(displayvalue,'#.0x');"
                        }
                        break;
                }
            }

            if (curGeo=='TAZ' && dom.byId('chkTAZIDLabels').checked==true) {
              _exp = "'TAZ ' + $feature['CO_TAZID'] + ': ' + " + _exp;
            }

            // create a text symbol to define the style of labels
            var volumeLabel = new TextSymbol();
            volumeLabel.font.setSize("8pt");
            volumeLabel.font.setFamily("arial");
            volumeLabel.font.setWeight(Font.WEIGHT_BOLD);
            volumeLabel.setHaloColor(sCWhite);
            volumeLabel.setHaloSize(dHaloSize);

            _minScaleForLabels = dGeo.find(o => o.value === curGeo).minScaleForLabels;

            // Create a JSON object which contains the labeling properties.
            labelClassOn = {
                minScale: _minScaleForLabels,
                labelExpression: _scoreExp,
                labelExpressionInfo: {expression: _exp}
            };
            labelClassOn.symbol = volumeLabel;
        }
    }

    // Setup empty volume label class for when toggle is off
    labelClassOff = ({
        minScale: 0,
        labelExpressionInfo: {expression: ""}
    })
    labelClassOff.symbol = volumeLabel;


    wSE._checkLabels();
    wSE._changeZoom();

    var _line         = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex("#555555"), 1.5);
    var _line_outline = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, Color.fromHex("#FFFFFF"), 4.5);
    var _rs           = new SimpleRenderer(new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, _line        , Color.fromHex("#BE222F")));
    var _rs_outline   = new SimpleRenderer(new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, _line_outline, Color.fromHex("#FFFFFF")));

    // if TAZ layer selected than add City Area layer as grey outline
    if ((curGeo=="CITYAREA" && _checkedCompareGeos==false) || (curGeo=="TAZ" && _checkedCompareGeos==false) || (_checkedCompareGeos==true && curGeoCompare=='CITYAREA')) {
        _lyrCityAreas        .setRenderer(_rs);
        _lyrCityAreasOutline .setRenderer(_rs_outline);
        _lyrCityAreas        .setLabelingInfo([labelClassOff])
        _lyrCityAreasOutline .setLabelingInfo([labelClassOff])
        _lyrCityAreas        .show();
        _lyrCityAreasOutline .show();
        // _lyrCenter           .hide();
        // _lyrCenterOutline    .hide();
        // _lyrOtherAreas       .hide();
        // _lyrOtherAreasOutline.hide();
        _lyrDistMed          .hide();
        _lyrDistMedOutline   .hide();
        _lyrDistLrg          .hide();
        _lyrDistLrgOutline   .hide();
        _lyrCounty           .hide();
        _lyrCountyOutline    .hide();

    } else if ((curGeo=="DISTMED" && _checkedCompareGeos==false) || (curGeo=="TAZ" && _checkedCompareGeos==true && curGeoCompare=='DISTMED')) {
        _lyrDistMed          .setRenderer(_rs);
        _lyrDistMedOutline   .setRenderer(_rs_outline);
        _lyrDistMed          .setLabelingInfo([labelClassOff])
        _lyrDistMedOutline   .setLabelingInfo([labelClassOff])
        _lyrCityAreas        .hide();
        _lyrCityAreasOutline .hide();
        // _lyrCenter           .hide();
        // _lyrCenterOutline    .hide();
        // _lyrOtherAreas       .hide();
        // _lyrOtherAreasOutline.hide();
        _lyrDistMed          .show();
        _lyrDistMedOutline   .show();
        _lyrDistLrg          .hide();
        _lyrDistLrgOutline   .hide();
        _lyrCounty           .hide();
        _lyrCountyOutline    .hide();

    } else if ((curGeo=="DISTLRG" && _checkedCompareGeos==false) || (curGeo=="TAZ" && _checkedCompareGeos==true && curGeoCompare=='DISTLRG')) {
        _lyrDistLrg          .setRenderer(_rs);
        _lyrDistLrgOutline   .setRenderer(_rs_outline);
        _lyrDistLrg          .setLabelingInfo([labelClassOff])
        _lyrDistMedOutline   .setLabelingInfo([labelClassOff])
        _lyrCityAreas        .hide();
        _lyrCityAreasOutline .hide();
        // _lyrCenter           .hide();
        // _lyrCenterOutline    .hide();
        // _lyrOtherAreas       .hide();
        // _lyrOtherAreasOutline.hide();
        _lyrDistMed          .hide();
        _lyrDistMedOutline   .hide();
        _lyrDistLrg          .show();
        _lyrDistLrgOutline   .show();
        _lyrCounty           .hide();
        _lyrCountyOutline    .hide();

    } else if ((curGeo=="COUNTY" && _checkedCompareGeos==false) || (_checkedCompareGeos==true && curGeoCompare=='COUNTY')) {
        _lyrCounty           .setRenderer(_rs);
        _lyrCountyOutline    .setRenderer(_rs_outline);
        _lyrCounty           .setLabelingInfo([labelClassOff])
        _lyrCountyOutline    .setLabelingInfo([labelClassOff])
        _lyrCityAreas        .hide();
        _lyrCityAreasOutline .hide();
        // _lyrCenter           .hide();
        // _lyrCenterOutline    .hide();
        // _lyrOtherAreas       .hide();
        // _lyrOtherAreasOutline.hide();
        _lyrDistMed          .hide();
        _lyrDistMedOutline   .hide();
        _lyrDistLrg          .hide();
        _lyrDistLrgOutline   .hide();
        _lyrCounty           .show();
        _lyrCountyOutline    .show();
    
    } else {
        _lyrCityAreas        .hide();
        _lyrCityAreasOutline .hide();
        _lyrCenter           .hide();
        _lyrCenterOutline    .hide();
        _lyrOtherAreas       .hide();
        _lyrOtherAreasOutline.hide();
        _lyrDistMed          .hide();
        _lyrDistMedOutline   .hide();
        _lyrDistLrg          .hide();
        _lyrDistLrgOutline   .hide();
        _lyrCounty           .hide();
        _lyrCountyOutline    .hide();
    }
},

_getChartData: function() {
    console.log('_getChartData');

    var _chartfileprefix = dGeo.find(o => o.value === curGeo).chartfileprefix;
    var _jsonfile = curGeo + '/' + _chartfileprefix + '_' + curID + '.json';
    
    if (curID!="") {
      // Get Season
      dojo.xhrGet({
        url: "widgets/SESidebar/data/chart/" + _jsonfile,
        handleAs: "json",
        load: function(obj) {
            /* here, obj will already be a JS object deserialized from the JSON response */
            console.log(_jsonfile + ' found');
            
            trenddata = obj

            storeTrends = Observable(new Memory({
                data: {
                  items: trenddata
                }
            }));

            wSE._updateChart();
        },
        error: function(err) {
            /* this will execute if the response couldn't be converted to a JS object,
                or if the request was unsuccessful altogether. */
        }
     });
    }
},

_updateChart: function() {
    console.log('_updateChart');

    for (c in dCat) { // loop through all categories
        var ssCat_N = new StoreSeries(storeTrends, { query: { C:dCat[c].value }, sort:[{attribute: "Y", descending: false}]}, {x:"Y",y:"N"});
        var ssCat_O = new StoreSeries(storeTrends, { query: { C:dCat[c].value }, sort:[{attribute: "Y", descending: false}]}, {x:"Y",y:"O"});
        cChart     .updateSeries(dCat[c].label                , ssCat_N);
        cChartBasic.updateSeries(dCat[c].label                , ssCat_N);
        cChart     .updateSeries(dCat[c].label + " - 2019 RTP", ssCat_O);
    }

    dom.byId('DETAILSTITLE').innerHTML = '<h2>' + dGeo.find(o => o.value === curGeo).charttitletext + curID + ' Trends</h2>';

    // if (curGeo=='TAZ'){
    //     new Tooltip({
    //         connectId : ["DETAILSTITLE"],
    //         label     : "<div  class=\"tooltip\" >CO_TAZID " + String(taz.find(o => o.CO_TAZID === curID).CO_TAZID) + "</div>"
    //     });
    // }

    cChart      .fullRender();
    cChartBasic .fullRender();
    lLegend     .refresh();
    lLegendBasic.refresh();

    // for first time turn off last 7 checks (2019 RTP)
    if (bFirst) {
        for (c=0;c<lLegend._cbs.length;c++) {
            if (c>=7 && lLegend._cbs[c].checked == true) {
                dom.byId(lLegend._cbs[c].id).click();
            }
        }
        bFirst = false;
    }

    // unhide chart area
    if (sMode=='BASIC') {
      dom.byId('DETAILS'         ).style.display = ''    ;
      dom.byId('DETAILSBASIC'    ).style.display = ''    ;
      dom.byId('DETAILSADVANCED' ).style.display = 'none';
      dom.byId('NEWFORECASTTITLE').innerHTML = 'Forecast';
    }

    // build table
    wSE._buildTable();

},

// JavaScript program to insert an
// element in a sorted array
    // Inserts a key in arr[] of given
    // capacity.  n is current size of arr[].
    // This function returns n+1 if insertion
    // is successful, else n.
_insertSorted: function ( arr, key, capacity) {
  
  n=arr.length;

  // Cannot insert more elements if n is already
  // more than or equal to capacity
  if (n >= capacity)
      return n;

  // check if value already there and exit if it is
  var i;
  for (i = 0; i<arr.length; i++) {
    if (arr[i]==key) {
      return n;
    }
  }

  var i;
  for (i = n - 1; (i >= 0 && arr[i] > key); i--)
      arr[i + 1] = arr[i];

  arr[i + 1] = key;

  return (n + 1);
},


_buildTable: function() {
    console.log('_buildTable');

    // header row
    var _strHeaderRowHTML = '<tr bgcolor="' + sCLightGrey + '"><td><strong>Year</strong></td>';

    // data rows
    var _strDataRowsHMTL_New = '';
    var _strDataRowsHMTL_Old = '';

    // shortened years -- MODIFY FOR ALL
    _years = dYears.filter( function(dYears){return (dYears.short==1);} );

    // get array of year values only
    _yearsonly = _years.map(function(item){return item.value;});

    // insert curYear into table (when a non-"short" year is selected)
    if (curTab=='FORECAST') {
      wSE._insertSorted(_yearsonly,curYear,100);
    } else if (curTab=='CHANGE') {
      wSE._insertSorted(_yearsonly,curYearFrom,100);
      wSE._insertSorted(_yearsonly,curYearTo,100);
    } else if (curTab=='NEWVSOLD') {
      wSE._insertSorted(_yearsonly,curYearNewOld,100);
    }

    // update array
    _years = _yearsonly;

    var _rownum = 0;

    for (y in _years) {
        //first column (year index)
        _rownum += 1;

        // color even rows
        if (_rownum & 1) {//odd
            var _rowcolor = '';
        } else { //even
            var _rowcolor = ' bgcolor="' + sCLightGrey + '"';
        }

        _strDataRowsHMTL_New += '<tr' + _rowcolor + '><td width="12.5%"><strong>' + _years[y] + '</strong></td>';
        _strDataRowsHMTL_Old += '<tr' + _rowcolor + '><td width="12.5%"><strong>' + _years[y] + '</strong></td>';

        _yeardata = trenddata.filter( function(trenddata){return (trenddata.Y==parseInt(_years[y]));} );
        for (c in dCat) {
            // only run once for each category
            if (y==0) {
                _strHeaderRowHTML += '<td align="center" width="12.5%"><strong>' + dCat.find(o => o.value === dCat[c].value).tabletitle + '</strong></td>'
            }

            // get New 'N' data

            var _value_New = _yeardata.find(o => o.C === dCat[c].value).N;
            var _value_Old = _yeardata.find(o => o.C === dCat[c].value).O;

            // round values
            var _roundvalue = dGeo.find(o => o.value === curGeo).roundchartvalues;

            _value_New = Math.round(_value_New / _roundvalue) * _roundvalue;
            _value_Old = Math.round(_value_Old / _roundvalue) * _roundvalue;

            // divide by acres if density
            if (curTblVal=='density') {
                // get acres
                switch (curGeo) {
                    case ('TAZ'      ): var _acres = acres_taz      .find(o => o.CO_TAZID     === curID).DEVACRES; break;
                    case ('CITYAREA' ): var _acres = acres_cityarea .find(o => o.CITY_NAME  === curID).DEVACRES; break;
                    case ('DISTMED'  ): var _acres = acres_distmed  .find(o => o.DMED_NAME   === curID).DEVACRES; break;
                    case ('DISTLRG'  ): var _acres = acres_distlrg  .find(o => o.DLRG_NAME   === curID).DEVACRES; break;
                    case ('COUNTY'   ): var _acres = acres_county   .find(o => o.CO_NAME   === curID).DEVACRES; break;
                    // case ('CENTER'   ): var _acres = acres_center   .find(o => o.CenterName === curID).DEVACRES; break;
                    // case ('OTHERAREA'): var _acres = acres_otherarea.find(o => o.OtherArea === curID).DEVACRES; break;
                }
                _value_New = (_value_New / _acres).toFixed(2);
                _value_Old = (_value_Old / _acres).toFixed(2);
            }

            if (curGeo!='TAZ' && curTblVal=='count') {
                _sPrefix = "<small>" ;
                _sSuffix = "</small>";
            } else {
                _sPrefix = "";
                _sSuffix = "";
            }

            // create highlight of cell value that corresponds to selected options
            if (dCat[c].value==curCat && (((_years[y]==curYear && curTab=='FORECAST') || (curTab=='NEWVSOLD' && _years[y]==curYearNewOld) || ((_years[y]==curYearFrom || _years[y]==curYearTo) && curTab=='CHANGE') ))) {
              var _sHighlighText = ' bgcolor="#FFFF00"';
            } else {
              var _sHighlighText = '';
            }

            // append cell HTML
            _strDataRowsHMTL_New += '<td align="right" width="12.5%"' + _sHighlighText + '>' + _sPrefix + wSE._NumberWithCommas(_value_New) + _sSuffix + '</td>';
            if (curTab=='NEWVSOLD') { // only  highlight Forecast 2019 Values  if NEWVSOLD
              _strDataRowsHMTL_Old += '<td align="right" width="12.5%"' + _sHighlighText + '>' + _sPrefix + wSE._NumberWithCommas(_value_Old) + _sSuffix + '</td>';
            } else { // 
              _strDataRowsHMTL_Old += '<td align="right" width="12.5%">' + _sPrefix + wSE._NumberWithCommas(_value_Old) + _sSuffix + '</td>';
            }
        }
        // append row end HTML
        _strDataRowsHMTL_New += '</tr>';
        _strDataRowsHMTL_Old += '</tr>';
    }

    // header row
    _strHeaderRowHTML += "</tr>"

    // final table HTML
    var _strTableHTML_New = '<table cellspacing=0 cellpadding=0>' + _strHeaderRowHTML + _strDataRowsHMTL_New + '</table>'
    var _strTableHTML_Old = '<table cellspacing=0 cellpadding=0>' + _strHeaderRowHTML + _strDataRowsHMTL_Old + '</table>'

    dom.byId('TABLENEW'     ).innerHTML = _strTableHTML_New;
    dom.byId('TABLENEWBASIC').innerHTML = _strTableHTML_New;
    dom.byId('TABLEOLD'     ).innerHTML = _strTableHTML_Old;

},

_NumberWithCommas: function(x) {
  if (Number.isInteger(x)) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return x;
  }
},

_RGBToHex: function(color) {
  r = color.r.toString(16);
  g = color.g.toString(16);
  b = color.b.toString(16);
  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;
  return "#" + r + g + b;
},

_selectFORECAST: function() {
    console.log('_selectFORECAST');
  
    if (curTab=="FORECAST") return;

    curTab = "FORECAST";

    // forecast is always absolute
    curAoP = 'absolute';

    dom.byId("FORECAST_CONTROL").classList.remove('unselectedToggle');
    dom.byId("FORECAST_CONTROL").classList.add   (  'selectedToggle');
    dom.byId("CHANGE_CONTROL"  ).classList.remove(  'selectedToggle');
    dom.byId("CHANGE_CONTROL"  ).classList.add   ('unselectedToggle');
  
    dom.byId("NEWVSOLD_CONTROL").classList.remove(  'selectedToggle');
    dom.byId("NEWVSOLD_CONTROL").classList.add   ('unselectedToggle');
  
    dom.byId("FORECAST_ICON").style.backgroundImage = "url('widgets/SESidebar/images/icon_forecast_blue.png')";
    dom.byId("CHANGE_ICON"  ).style.backgroundImage = "url('widgets/SESidebar/images/icon_change_white.png' )";
    dom.byId("NEWVSOLD_ICON").style.backgroundImage = "url('widgets/SESidebar/images/icon_vs_white.png'     )";
  
    dom.byId("YEARS_FORECAST").style.display = ''    ;
    dom.byId("YEARS_CHANGE"  ).style.display = 'none';
    dom.byId("YEARS_NEWVSOLD").style.display = 'none';

    dom.byId("AOP").style.display = 'none';

    wSE._updateDisplay_Step1_CompareGeos();
    wSE._getChartData();
},

_selectCHANGE: function() {
    console.log('_selectCHANGE');
  
    if (curTab=="CHANGE") return;
    
    curTab = "CHANGE";
  
    dom.byId("FORECAST_CONTROL").classList.remove(  'selectedToggle');
    dom.byId("FORECAST_CONTROL").classList.add   ('unselectedToggle');
    dom.byId("CHANGE_CONTROL"  ).classList.remove('unselectedToggle');
    dom.byId("CHANGE_CONTROL"  ).classList.add   (  'selectedToggle');
  
    dom.byId("NEWVSOLD_CONTROL").classList.remove(  'selectedToggle');
    dom.byId("NEWVSOLD_CONTROL").classList.add   ('unselectedToggle');
  
    dom.byId("FORECAST_ICON").style.backgroundImage = "url('widgets/SESidebar/images/icon_forecast_white.png')";
    dom.byId("CHANGE_ICON"  ).style.backgroundImage = "url('widgets/SESidebar/images/icon_change_blue.png'   )";
    dom.byId("NEWVSOLD_ICON").style.backgroundImage = "url('widgets/SESidebar/images/icon_vs_white.png'      )";
  
    dom.byId("YEARS_FORECAST").style.display = 'none';
    dom.byId("YEARS_CHANGE"  ).style.display = ''    ;
    dom.byId("YEARS_NEWVSOLD").style.display = 'none';
  
    dom.byId("AOP").style.display = '';

    wSE._updateDisplay_Step1_CompareGeos();
    wSE._getChartData();
},

_selectNEWVSOLD: function() {
    console.log('_selectNEWVSOLD');
    
    if (curTab=="NEWVSOLD") return;

    curTab = "NEWVSOLD";
    
    dom.byId("FORECAST_CONTROL").classList.remove(  'selectedToggle');
    dom.byId("FORECAST_CONTROL").classList.add   ('unselectedToggle');
    dom.byId("CHANGE_CONTROL"  ).classList.remove(  'selectedToggle');
    dom.byId("CHANGE_CONTROL"  ).classList.add   ('unselectedToggle');
    
    dom.byId("NEWVSOLD_CONTROL").classList.remove('unselectedToggle');
    dom.byId("NEWVSOLD_CONTROL").classList.add   (  'selectedToggle');
    
    dom.byId("FORECAST_ICON").style.backgroundImage = "url('widgets/SESidebar/images/icon_forecast_white.png')";
    dom.byId("CHANGE_ICON"  ).style.backgroundImage = "url('widgets/SESidebar/images/icon_change_white.png'  )";
    dom.byId("NEWVSOLD_ICON").style.backgroundImage = "url('widgets/SESidebar/images/icon_vs_blue.png'       )";
    
    dom.byId("YEARS_FORECAST").style.display = 'none';
    dom.byId("YEARS_CHANGE"  ).style.display = 'none';
    dom.byId("YEARS_NEWVSOLD").style.display = '';
  
    dom.byId("AOP").style.display = '';

    wSE._updateDisplay_Step1_CompareGeos();
    wSE._getChartData();
},

_checkSELabel: function() {
  
},
//Run onOpen when receiving a message from OremLayerSymbology
onReceiveData: function(name, widgetId, data, historyData) {
  console.log('onReceiveData');
  
  // if (data.message=="TurnOnAdvanced") {
  //   sMode="ADVANCED";
  //   this._turnOnAdvanced(); 
  // } else if(data.message=="TurnOnBasic") {
  //   sMode="BASIC";
  //   this._turnOnBasic();
  // }
  
},
onOpen: function() {
  console.log('onOpen');
},
onClose: function() {
  console.log('onClose');
  
},
onMinimize: function() {
  console.log('onMinimize');
},
onMaximize: function() {
  console.log('onMaximize');
},
onSignIn: function(credential) {
  /* jshint unused:false*/
  console.log('onSignIn');
},
onSignOut: function() {
  console.log('onSignOut');
},
//added from Demo widget Setting.js
setConfig: function(config) {
var test = "";
},
getConfigFrom: function() {
  //WAB will get config object through this method
  return {
    //districtfrom: this.textNode.value
  };
},

      
_getCookieKey: function() {
  return 'isfirst_' + encodeURIComponent(jimuUtils.getAppIdFromUrl());
},

_getCookieCountyVol: function() {
  return 'countyvol_'+ encodeURIComponent(jimuUtils.getAppIdFromUrl());
},

_setCookieCountyVol: function() {
  //setup cookie so user comes back to same county
  var cookieCountyVol = this._getCookieCountyVol();
  cookie(cookieCountyVol, curCountyVol, {
    expires: 1000*60*60*24*30,
    path: '/'
  });
},

_openLegend: function() {
    console.log('_openLegend');

    var pm = PanelManager.getInstance();
    var bOpen = false;
    
    //Close Legend Widget if open
    for (var p=0; p < pm.panels.length; p++) {
      if (pm.panels[p].label == "Legend") {
        if (pm.panels[p].state != "closed") {
          bOpen=true;
          pm.closePanel(pm.panels[p]);
          dom.byId('SHOWHIDELEGEND').innerHTML = '<small>Show Large Legend<\small>';
        }
      }
    }
  
    if (!bOpen) {
      pm.showPanel(this.appConfig.widgetOnScreen.widgets[WIDGETPOOLID_LEGEND]);
      dom.byId('SHOWHIDELEGEND').innerHTML = '<small>Hide Large Legend<\small>';
    }
},

_openFeedback: function() {
    console.log('_openFeedback');

    var pm = PanelManager.getInstance();
    
    //Close Widget
    //for (var p=0; p < pm.panels.length; p++) {
    //  if (pm.panels[p].label == "About") {
    //    pm.closePanel(pm.panels[p]);
    //  }
    //}
    
    //Open Widget
    pm.showPanel(this.appConfig.widgetPool.widgets[0]);
    
},

_closeFeedback: function() {
    console.log('_closeFeedback');
    var pm = PanelManager.getInstance();

    //Close Feedback Widget if open
    for (var p=0; p < pm.panels.length; p++) {
        if (pm.panels[p].label == "Feedback") {
            if (pm.panels[p].state != "closed") {
                pm.closePanel(pm.panels[p]);
            }
        }
    }
    
},

_incrementDownAll: function() {
  console.log('_incrementDownAll');

  var _lowBound = 2019;

  if (curTab=='FORECAST') {
    curYear = _lowBound;
    cmbYear.set("value",_lowBound);
    wSE._updateDisplay();
    wSE._getChartData();  
  } else if (curTab=='CHANGE') {
    curYearFrom = _lowBound;
    curYearTo = _lowBound + parseInt(dom.byId('cmbInterval').value);
    cmbYearFrom.set("value",curYearFrom);
    cmbYearTo.set("value",curYearTo);
    wSE._updateDisplay();
    wSE._getChartData();  
  } else if (curTab=='NEWVSOLD') {
    var _lowBound = 2020;
    curYearNewOld = _lowBound;
    cmbYearNewOld.set("value",curYearNewOld);
    wSE._updateDisplay();
    wSE._getChartData();  
  }

},


_incrementUpAll: function() {
  console.log('_incrementUpAll');
  
  var _upperbound = 2050;

  if (curTab=='FORECAST') {
    curYear = _upperbound;
    cmbYear.set("value",curYear);
    wSE._updateDisplay();
    wSE._getChartData();  
  } else if (curTab=='CHANGE') {
    curYearFrom = _upperbound - parseInt(dom.byId('cmbInterval').value);
    curYearTo = _upperbound;
    cmbYearFrom.set("value",curYearFrom);
    cmbYearTo.set("value",curYearTo);
    wSE._updateDisplay();
    wSE._getChartData();  
  } else if (curTab=='NEWVSOLD') {
    curYearNewOld = _upperbound;
    cmbYearNewOld.set("value",curYearNewOld);
    wSE._updateDisplay();
    wSE._getChartData();  
  }

},

_incrementDown: function() {
  console.log('_incrementDown');
  var _lowBound = 2019;

  if (parseInt(dom.byId('cmbInterval').value)==1) {
    _lowBound = 2019;
  } else {
    _lowBound = 2020;
  }


  if (curTab=='FORECAST') {
    var _newYear = parseInt(curYear) - parseInt(dom.byId('cmbInterval').value);
    if (parseInt(dom.byId('cmbInterval').value)!=1) {
      _newYear = wSE._roundNearest5(_newYear);
    }
    if (curYear<=_lowBound) {
      //empty
    } else if (_newYear>=_lowBound) {
      curYear = _newYear;
      cmbYear.set("value",_newYear)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    } else if (_newYear<_lowBound) {
      curYear = _lowBound;
      cmbYear.set("value",_lowBound)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    }
  } else if (curTab=='CHANGE') {
    var _newYearFrom = parseInt(curYearFrom) - parseInt(dom.byId('cmbInterval').value);
    if (parseInt(dom.byId('cmbInterval').value)!=1) {
      if (_newYearFrom<2020) {
        _newYearFrom = 2020;
      }
      _newYearFrom = wSE._roundNearest5(_newYearFrom);
    }
    var _newYearTo = parseInt(curYearTo) - parseInt(dom.byId('cmbInterval').value);
    if (parseInt(dom.byId('cmbInterval').value)!=1) {
      if (_newYearTo<2020) {
        _newYearTo = 2020;
      }
      _newYearTo = wSE._roundNearest5(_newYearTo);
    }


    if (curYearFrom<=_lowBound || _newYearFrom==_newYearTo) {
      //empty
    } else if (_newYearFrom>=_lowBound) {
      curYearFrom = _newYearFrom;
      cmbYearFrom.set("value",_newYearFrom)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    } else if (_newYearFrom<_lowBound) {
      curYearFrom = _lowBound;
      cmbYearFrom.set("value",_lowBound)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    }

    if (curYearTo<=_lowBound || _newYearFrom==_newYearTo) {
      //empty
    } else if (_newYearTo>=_lowBound) {
      curYearTo = _newYearTo;
      cmbYearTo.set("value",_newYearTo)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    } else if (_newYearTo<_lowBound) {
      curYearTo = _lowBound;
      cmbYearTo.set("value",_lowBound)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    }
  } else if (curTab=='NEWVSOLD') {
    var _newYearNewOld = parseInt(curYearNewOld) - parseInt(dom.byId('cmbInterval').value);
    if (parseInt(dom.byId('cmbInterval').value)!=1) {
      _newYearNewOld = wSE._roundNearest5(_newYearNewOld);
    }
    if (curYearNewOld<=_lowBound) {
      //empty
    } else if (_newYearNewOld>=2020) {
      curYearNewOld = _newYearNewOld;
      cmbYearNewOld.set("value",_newYearNewOld)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    } else if (_newYearNewOld<2020) {
      curYearNewOld = 2020;
      cmbYearNewOld.set("value",2020)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    }
  }
},

_roundNearest5: function(num) {
  return Math.round(num / 5) * 5;
},

_incrementUp: function() {
  console.log('_incrementUp');
  if (curTab=='FORECAST') {
    var _newYear = parseInt(curYear) + parseInt(dom.byId('cmbInterval').value);
    if (parseInt(dom.byId('cmbInterval').value)!=1) {
      _newYear = wSE._roundNearest5(_newYear);
    }
    if (curYear==2050) {
      // empty
    } else if (_newYear<=2050) {
      curYear = _newYear;
      cmbYear.set("value",_newYear)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    } else if (_newYear>2050) {
      curYear = 2050;
      cmbYear.set("value",2050)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    }
  } else if (curTab=='CHANGE') {
    var _newYearFrom = parseInt(curYearFrom) + parseInt(dom.byId('cmbInterval').value);
    var _newYearTo = parseInt(curYearTo) + parseInt(dom.byId('cmbInterval').value);
    
    if (parseInt(dom.byId('cmbInterval').value)!=1) {
      _newYearFrom = wSE._roundNearest5(_newYearFrom);
    }
    if (parseInt(dom.byId('cmbInterval').value)!=1) {
      _newYearTo = wSE._roundNearest5(_newYearTo);
    }

    if (_newYearFrom>2050) {
      _newYearFrom = 2050;
    }
    if (_newYearTo>2050) {
      _newYearTo = 2050;
    }

    if (curYearFrom==2050 || _newYearFrom==_newYearTo) {
      // empty
    } else if (_newYearFrom<=2050) {
      curYearFrom = _newYearFrom;
      cmbYearFrom.set("value",_newYearFrom)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    } else if (_newYearFrom>2050) {
      curYearFrom = 2050;
      cmbYearFrom.set("value",2050)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    }

    if (curYearTo==2050 || _newYearFrom==_newYearTo) {
      // empty
    } else if (_newYearTo<=2050) {
      curYearTo = _newYearTo;
      cmbYearTo.set("value",_newYearTo)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    } else if (_newYearTo>2050) {
      curYearTo = 2050;
      cmbYearTo.set("value",2050)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    }
  } else if (curTab=='NEWVSOLD') {
    var _newYearNewOld = parseInt(curYearNewOld) + parseInt(dom.byId('cmbInterval').value);
    if (parseInt(dom.byId('cmbInterval').value)!=1) {
      _newYearNewOld = wSE._roundNearest5(_newYearNewOld);
    }
    if (curYearNewOld==2050) {
      // empty
    } else if (_newYearNewOld<=2050) {
      curYearNewOld = _newYearNewOld;
      cmbYearNewOld.set("value",_newYearNewOld)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    } else if (_newYearNewOld>2050) {
      curYearNewOld = 2050;
      cmbYearNewOld.set("value",2050)
      wSE._updateDisplay_Step1_CompareGeos();
      wSE._getChartData();  
    }
  }
},

_checkCenters: function() {
  console.log('_checkCenters');
  if (dom.byId("chkCenters").checked == true) {
    lyrCenters       .show();
    lyrCentersOutline.show();
  } else {
    lyrCenters       .hide();
    lyrCentersOutline.hide();
  }
},

_checkSAPs: function() {
  console.log('_checkSAPs');
  if (dom.byId("chkSAPs").checked == true) {
    lyrSAP_BRT        .show();
    lyrSAP_FrontRunner.show();
    lyrSAP_TRAX       .show()
  } else {
    lyrSAP_BRT        .hide();
    lyrSAP_FrontRunner.hide();
    lyrSAP_TRAX       .hide()
  }
},

_checkREMM: function() {
  console.log('_checkREMM');
  if (dom.byId("chkREMM").checked == true) {
    lyrREMMBoundary.show();
  } else {
    lyrREMMBoundary.hide()
  }
},

_checkLabels: function() {
    console.log('_checkLabels');

    if (dom.byId("chkLabels").checked == true) {
        lyrDisplay.setLabelingInfo([ labelClassOn  ]);
    } else {
        lyrDisplay.setLabelingInfo([ labelClassOff ]);
    }

},


_checkUtahCountyMask: function() {
  console.log('_checkUtahCountyMask');

  if (dom.byId("chkUtahCountyMask").checked == true) {
      lyrMasks.setDefinitionExpression("Masks IN ('FullMask','NoMask')");
      lyrMasks.refresh();
  } else {
      lyrMasks.setDefinitionExpression("");
      lyrMasks.refresh();
  }

},

_changeZoom: function(){
    dScale = wSE.map.getScale();
    if(dScale < dGeo.find(o => o.value === curGeo).minScaleForLabels){
      //enable the checkbox
      dom.byId("LABELS").style.display = '';
    }else{
      //diable the checkbox
      dom.byId("LABELS").style.display = 'none';
    }
  },

    
  _turnOnAdvanced: function() {
    console.log('_turnOnAdvanced');

    dom.byId("NEWVSOLDCELL").style.display = '';
    dom.byId("TAZLOOKUP").style.display = '';
    dom.byId("COMPAREGEOGRAPHIES").style.display = '';

    //dom.byId("INCREMENT").style.display = '';
    //dom.byId("UTAHCOUNTYMASK").style.display = '';
    lyrMasks.setDefinitionExpression("Masks IN ('FullMask','NoMask')"); // do not show utah county masked in advanced version
    wSE._updateDisplay_Step1_CompareGeos();
    wSE._getChartData();

  },
  
  _turnOnBasic: function() {
    console.log('_turnOnBasic');

    if (curTab=='NEWVSOLD') { // when basic is selected need to change tab if current one is New Vs Old, which isn't in the basic version
      curTab=='FORECAST'
    }

    dom.byId("NEWVSOLDCELL").style.display = 'none';
    dom.byId("TAZLOOKUP").style.display = 'none';
    dom.byId("COMPAREGEOGRAPHIES").style.display = 'none';

    //dom.byId("INCREMENT").style.display = 'none';
    //dom.byId("UTAHCOUNTYMASK").style.display = 'none';
    lyrMasks.setDefinitionExpression("");  // show utah county masked in advanced version
    wSE._updateDisplay_Step1_CompareGeos();
    wSE._getChartData();
    
  },

  _findTAZ: function() {
    console.log('_findTAZ')

    var _findTAZID = dom.byId("TAZInput").value;

    // zoom to TAZ
    
    queryTask = new esri.tasks.QueryTask(lyrDisplay.url);
    
    query = new esri.tasks.Query();
    query.returnGeometry = true;
    query.outFields = ["*"];
    query.where = "CO_TAZID = " + _findTAZID;
    
    queryTask.execute(query, showResults);
    
    function showResults(featureSet) {
      
      var feature, featureId;
      
      //QueryTask returns a featureSet.  Loop through features in the featureSet and add them to the map.
      if (featureSet.features.length>0) {
        //clearing any graphics if present. 

        wSE.map.graphics.clear();

        for (i = 0; i < featureSet.features.length; i++) { 
          var graphic = featureSet.features[i]; 
          var thisExtent = graphic.geometry.getExtent(); 

          // making a union of extent or previous feature and current feature. 
          thisExtent = thisExtent.union(thisExtent);

          var _sfs = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
            new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
            new Color([255,255,0]), 5),new Color([255,255,0,0.25])
          );
          graphic.setSymbol(_sfs); 

          wSE.map.graphics.add(graphic); 
        } 

        wSE.map.setExtent(thisExtent.expand(2)); 

        curID = _findTAZID;
        //wSE._updateDisplay_Step1_CompareGeos();
        wSE._getChartData();
      }
    }

  }

  });
});