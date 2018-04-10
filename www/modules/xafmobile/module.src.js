var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var DevExpress;
(function (DevExpress) {
    var ExpressApp;
    (function (ExpressApp) {
        var Mobile;
        (function (Mobile) {
            var DataSourcePropertyIsNullMode;
            (function (DataSourcePropertyIsNullMode) {
                DataSourcePropertyIsNullMode[DataSourcePropertyIsNullMode["SelectNothing"] = 0] = "SelectNothing";
                DataSourcePropertyIsNullMode[DataSourcePropertyIsNullMode["SelectAll"] = 1] = "SelectAll";
                DataSourcePropertyIsNullMode[DataSourcePropertyIsNullMode["CustomCriteria"] = 2] = "CustomCriteria";
            })(DataSourcePropertyIsNullMode || (DataSourcePropertyIsNullMode = {}));
            ;
            var wrapStore = function (mainStore, context, options) {
                var lookupStore = Object.create(mainStore);
                lookupStore.load = function (loadOptions) {
                    if (!options.url && options.dataSourcePropertyIsNullMode !== undefined) {
                        switch (options.dataSourcePropertyIsNullMode) {
                            case DataSourcePropertyIsNullMode.SelectNothing: return $.Deferred().resolve([]).promise();
                            case DataSourcePropertyIsNullMode.SelectAll: return mainStore.load(__assign({}, loadOptions, { filter: null }));
                            case DataSourcePropertyIsNullMode.CustomCriteria: return mainStore.load(__assign({}, loadOptions, { filter: options.dataSourcePropertyIsNullCriteria }));
                        }
                    }
                    else {
                        return mainStore.load(__assign({}, loadOptions, { urlOverride: options.url }));
                    }
                };
                lookupStore.byKey = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var key = args[0], model = context.$model, currentObjectKey = AppPlayer.compileGetter('model.CurrentObject.' + options.propertyName + '.' + lookupStore.key())({ model: model });
                    if (currentObjectKey == key) {
                        var promise = new $.Deferred();
                        promise.resolve(AppPlayer.compileGetter('model.CurrentObject.' + options.propertyName)({ model: model }));
                        return promise.promise();
                    }
                    else {
                        return mainStore.byKey(args);
                    }
                };
                return lookupStore;
            };
            AppPlayer.Stores.StoreFactory.creators["xaf-lookup-store"] = function (options, application, context) {
                return wrapStore(application.stores[options.mainStoreId], context, options);
            };
            //test("Lookup data store", () => {
            //    var stores: { [key: string]: dxdata.Store } = {
            //        ContactStore: new dxdata.CustomStore({
            //            load: (options?: dxdata.LoadOptions) => {
            //                loadOptions = options;
            //                return $.Deferred().resolve([]).promise();
            //            }
            //        })
            //    },
            //        dataSourceConfig: AppPlayer.IDataSource = {
            //            id: "employee",
            //            store: {
            //                id: "testStore",
            //                mainStoreId: "ContactStore",
            //                type: "xaf-lookup-store",
            //                url: "$model.contact",
            //                lookupEmptyBehaviour: lookupEmptyBehaviourEnum.custom, // empty, all
            //                customCriteria: ["name", "test"]
            //            }
            //        },
            //        application = new TestApplication(),
            //        model = apm.createModel({
            //            model: [
            //                { name: "contact", defaultValue: "contactId" },
            //            ]
            //        }, application),
            //        loadOptions = null;
            //    AppPlayer.Stores.StoreFactory.creators["xaf-lookup-store"] = (options, application) => {
            //        return wrapStore(stores[options.mainStoreId], <any>options);
            //    }
            //    let dataSource = apd.createDataSource(dataSourceConfig, { $model: model }, stores, application);
            //    dataSource.load().then(() => {
            //        deepEqual(loadOptions, {
            //            "searchExpr": undefined,
            //            "searchOperation": "contains",
            //            "searchValue": null,
            //            "skip": 0,
            //            "take": 20,
            //            "userData": {}
            //        }, "normal load");
            //    });
            //    model.contact = null;
            //    dataSource.load().then(() => {
            //        deepEqual(loadOptions, {
            //            "filter": [
            //                "name",
            //                "test"
            //            ],
            //            "searchExpr": undefined,
            //            "searchOperation": "contains",
            //            "searchValue": null,
            //            "skip": 0,
            //            "take": 20,
            //            "userData": {}
            //        }, "custom filter");
            //    });
            //})
        })(Mobile = ExpressApp.Mobile || (ExpressApp.Mobile = {}));
    })(ExpressApp = DevExpress.ExpressApp || (DevExpress.ExpressApp = {}));
})(DevExpress || (DevExpress = {}));
var DevExpress;
(function (DevExpress) {
    var ExpressApp;
    (function (ExpressApp) {
        var Mobile;
        (function (Mobile) {
            function processResult(_a) {
                var result = _a.result, model = _a.model, actionId = _a.actionId, actionParameter = _a.actionParameter, $global = _a.$global, $functions = _a.$functions;
                if (!!result.error) {
                    var resultInstanceAnnotation = result.error.errorDetails['error.modelState'];
                    var updateStateModel = !!resultInstanceAnnotation && resultInstanceAnnotation.startsWith('{') ? JSON.parse(resultInstanceAnnotation) : undefined;
                    if (!!updateStateModel && !!updateStateModel.ViewModel) {
                        $.extend(true, model, updateStateModel.ViewModel);
                    }
                }
                else {
                    if (result.GlobalModel) {
                        $.extend(true, $global, result.GlobalModel);
                    }
                    var viewModel = result.ViewModel;
                    if (viewModel) {
                        var shouldNavigate = !model || viewModel.name != model.name;
                        if (model) {
                            if (shouldNavigate && !viewModel.IsClosed && viewModel.RootViewModel) {
                                $.extend(true, model, viewModel.RootViewModel);
                            }
                            else {
                                $.extend(true, model, viewModel);
                            }
                        }
                        if (viewModel.IsModified) {
                            $global.reloadListDataSource({ model: model });
                        }
                        if (viewModel.IsClosed) {
                            $global.refreshViewOnLoad = true;
                            if (viewModel.overrideHistory) {
                                $functions.navigateToView(null, null);
                            }
                            else {
                                $functions.back();
                            }
                        }
                        else {
                            if (shouldNavigate) {
                                var navigateParameters = {};
                                if (viewModel.CurrentObject) {
                                    if (!!viewModel.IsNewCurrentObject) {
                                        navigateParameters = {
                                            CurrentObjectNew: viewModel.CurrentObject,
                                        };
                                    }
                                    else {
                                        navigateParameters = {
                                            CurrentObjectEdit: viewModel.CurrentObject,
                                        };
                                    }
                                }
                                if (!!actionId && !!viewModel.IsNewCurrentObject) {
                                    $.extend(true, navigateParameters, {
                                        RootViewModel: {
                                            'ClickedActionId': actionId,
                                            'ClickedActionParameter': actionParameter,
                                        }
                                    });
                                }
                                if (!!model && !!viewModel.IsNewCurrentObject) {
                                    $.extend(true, navigateParameters, {
                                        RootViewModel: {
                                            'name': model.name,
                                            'CurrentObject': model.CurrentObject,
                                            'SelectedItems': model.SelectedItems,
                                            'SelectedObjects': model.SelectedObjects,
                                            'RootViewModel': model.RootViewModel
                                        }
                                    });
                                }
                                try {
                                    $functions.navigateToView(viewModel.name, navigateParameters);
                                }
                                catch (ex) {
                                    $global.uf_Notify({ 'value': { 'message': ex + ' Try to set MobileVisible=\"True\" for this view in ModelEditor.' } });
                                }
                            }
                        }
                    }
                }
            }
            Mobile.processResult = processResult;
            Mobile.updateComponentInfo = function (name, componentInfo) {
                var playerViews = AppPlayer.Views;
                if (componentInfo.rendererType === undefined) {
                    componentInfo.rendererType = playerViews.ComponentMarkupRenderBase;
                }
                playerViews.componentInfos[name] = componentInfo;
            };
            Mobile.navigateToDetailView = function (detailViewId, objectId) {
                var application = AppPlayer.Application.get();
                application.functions.navigateToView(detailViewId, { CurrentObjectEdit: objectId });
            };
            Mobile.encodeHtml = function (text) {
                return AppPlayer.escapeHtml(AppPlayer.htmlEncode(text));
            };
            //export var evalFunction = function (functionText) {
            //    var preparedFunctionText = functionText;
            //    if (!functionText.startsWith("(") && !functionText.endsWith(")")) {
            //        preparedFunctionText = "(" + preparedFunctionText + ")";
            //    }
            //    return eval(preparedFunctionText);
            //};
        })(Mobile = ExpressApp.Mobile || (ExpressApp.Mobile = {}));
    })(ExpressApp = DevExpress.ExpressApp || (DevExpress.ExpressApp = {}));
})(DevExpress || (DevExpress = {}));
//# sourceMappingURL=module.src.js.map