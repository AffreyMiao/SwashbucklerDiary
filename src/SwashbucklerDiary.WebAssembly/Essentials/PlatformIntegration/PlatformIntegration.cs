﻿using Microsoft.JSInterop;
using SwashbucklerDiary.Rcl.Essentials;
using SwashbucklerDiary.Rcl.Services;

namespace SwashbucklerDiary.WebAssembly.Essentials
{
    public partial class PlatformIntegration : IPlatformIntegration
    {
        private readonly IAlertService _alertService;

        private readonly II18nService _i18n;

        private readonly ILogger _logger;

        private readonly Lazy<Task<IJSInProcessObjectReference>> _module;

        private Task<IJSInProcessObjectReference> Module => _module.Value;

        public PlatformIntegration(IAlertService alertService, 
            II18nService i18n,
            ILogger<PlatformIntegration> logger,
            IJSRuntime jS)
        {
            _alertService = alertService;
            _i18n = i18n;
            _logger = logger;
            // import need async
            //https://github.com/dotnet/aspnetcore/issues/29808
            _module = new(() => ((IJSInProcessRuntime)jS).InvokeAsync<IJSInProcessObjectReference>("import", "./js/platformIntegration.js").AsTask());
        }
    }
}
