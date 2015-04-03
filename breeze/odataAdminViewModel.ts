/// <reference path="../../scripts/typings/breeze/breeze.d.ts" />

import start = require("x/start");
import configmgr = require("x/configmgr");

export var model = new kendo.data.ObservableObject({
    generateTypeScriptDefinitions: () => {
        generateTypeInfo();
    }
});

export var odataDataService: breeze.DataService;
export var odataEntityManager: breeze.EntityManager;

export function init(e) {
    e.view.bind("show", show);
    e.view.bind("hide", hide);
    kendo.bind(e.view.element[0], model);

    $("#odataAdminContainer").append($("<script>")).attr('src', '//google-code-prettify.googlecode.com/svn/loader/run_prettify.js');
    // generateTypeInfo(configmgr.baseUrl + "/PetroWEB.Config/Services/AppConfigs.svc");
};

export function show(e) {
};

export function hide(e) {
};

export function getJsType(metadataType) {
    if (/(Int64)|(Int32)|(Int16)|(Byte)|(Decimal)|(Double)|(Single)|(number)/.test(metadataType))
        return 'number';
    else if (/(DateTime)|(DateTimeOffset)|(Time)|(Date)/.test(metadataType))
        return 'Date';
    else if (/(Boolean)/i.test(metadataType))
        return 'boolean';
    return 'string';
}

export function generateTypeInfo() {
    var serviceUri = $("#serviceUrl").data("kendoComboBox").value() + "/"
        + $("#service").data("kendoComboBox").value() + ".svc";

    breeze.config.initializeAdapterInstance("dataService", "odata", true);
    odataDataService = new breeze.DataService({
        serviceName: serviceUri,
        hasServerMetadata: true,
        useJsonp: false
    });
    odataEntityManager = new breeze.EntityManager({ dataService: odataDataService });

    odataEntityManager.fetchMetadata()
        .then(() => {
            var typeScriptDefText = '/// &lt;reference path="../../../scripts/typings/breeze/breeze.d.ts" /&gt;\r\n\r\ndeclare module ' + $("#service").data("kendoComboBox").value() + ' {\r\n    ',
                entityTypes = odataEntityManager.metadataStore.getEntityTypes(),
                crlf = "\r\n    ",
                code = document.createElement('code');

            for (var i = 0; i < entityTypes.length; i++) {
                // type declaration
                var entityType = entityTypes[i];
                typeScriptDefText += 'export interface ' + entityType.shortName;

                // base type
                typeScriptDefText += ' extends ';
                if (entityType.hasOwnProperty('baseEntityType')) {
                    typeScriptDefText += entityType.shortName;
                } else {
                    typeScriptDefText += 'breeze.Entity';
                }
                typeScriptDefText += ' {' + crlf;

                // data properties
                for (var j = 0; j < entityType.dataProperties.length; j++) {
                    var property = entityType.dataProperties[j];
                    //if (entityType && entityType.dataProperties.filter(p => p.name === property.name).length > 0)
                    //    continue;
                    typeScriptDefText += '    ' + property.name;
                    if (property.isNullable)
                        typeScriptDefText += '?';
                    typeScriptDefText += ': ' + getJsType(property.dataType.getName()) + ' //' + crlf;
                }

                // navigation properties
                for (j = 0; j < (<breeze.EntityType>entityType).navigationProperties.length; j++) {
                    var navProperty = (<breeze.EntityType>entityType).navigationProperties[j];
                    //if (entityType.baseEntityType && entityType.baseEntityType.navigationProperties.filter(function (p) { return p.name === property.name; }).length > 0)
                    //    continue;
                    typeScriptDefText += '    ' + navProperty.name;
                    typeScriptDefText += ': ';
                    if (navProperty.isScalar) {
                        typeScriptDefText += navProperty.entityType.shortName;
                    } else {
                        typeScriptDefText += 'Array&lt;';
                        typeScriptDefText += navProperty.entityType.shortName;
                        typeScriptDefText += '&gt;';
                    }

                    typeScriptDefText += ';' + crlf;
                }

                typeScriptDefText += '}' + crlf + crlf;
            }

            typeScriptDefText += '\r\n}';

            code.innerHTML = typeScriptDefText;
            var codeText = typeScriptDefText.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            var codeFileName = $("#service").data("kendoComboBox").value() + ".d.ts";

            $("#generatedResults").html("<br><br>");
            $("<a />")
                .attr("href", window["URL"].createObjectURL(
                    new Blob([codeText], { type: 'text/plain' })))
                .attr("download", codeFileName)
                .text("download " + codeFileName)
                .appendTo($("#generatedResults"));
            $("<br><br>").appendTo($("#generatedResults"));
            $(code).addClass('prettyprint').appendTo($("#generatedResults"));
        })
        .fail(reason => { alert(reason); });
}

export function runQuery() {

    breeze.config.initializeAdapterInstance("dataService", "odata", true);
    odataDataService = new breeze.DataService({
        serviceName: configmgr.baseUrl + "/PetroWEB.Config/Services/AppConfigs.svc",
        hasServerMetadata: true,
        useJsonp: false
    });
    odataEntityManager = new breeze.EntityManager({ dataService: odataDataService });

    var entityQuery = new breeze.EntityQuery().from("NE_App").inlineCount();
    odataEntityManager.executeQuery(entityQuery)
        .then(queryResult => {
            // alert("retrieved app list :)\r\n" + queryResult.inlineCount + " apps.");

            $("#appCardsContainer div").remove();

            var divs =
                d3.select("#appCardsContainer")
                    .selectAll("div")
                    .data(queryResult.results);

            var newdivs = divs.enter();
            var newdivs2 = newdivs.append("div").classed("appCard", true).style("width", "250px")
                .on("click", function () {
                    newdivs2.classed("wellCardSelected", false);
                    $(this).addClass("wellCardSelected");
                    setTimeout(() => {
                        alert("show app: " + d3.select(this).datum().Name);
                        //app.welldataService.viewModel.currentWell = d3.select(clickedWellCard).datum();
                        //app.drawerPath = "wells.launch"
                        //    $("#my-drawer").data("kendoMobileDrawer").show();
                    }, 500);
                });

            newdivs2.append("img").property("src", d => {
                if (!d.Logo_Data) {
                    return "";
                }

                var binary = atob(d.Logo_Data);
                var len = binary.length;
                var buffer = new ArrayBuffer(len);
                var view = new Uint8Array(buffer);
                for (var i = 0; i < len; i++) {
                    view[i] = binary.charCodeAt(i);
                }
                var blob = new Blob([view], { type: "image/jpg" });
                var urlCreator = window["URL"] || window["webkitURL"];
                var imageUrl = urlCreator.createObjectURL(blob);
                return imageUrl;
            });
            newdivs2.append("p").text(d => d.Description);
            newdivs2.append("p").append("strong").text(d => d.Name);

            $("#appCards").data("kendoMobileView").scroller.reset();
        })
        .fail(reason => {
            var bbvb = reason;
        });

}
export var wrap = false;
