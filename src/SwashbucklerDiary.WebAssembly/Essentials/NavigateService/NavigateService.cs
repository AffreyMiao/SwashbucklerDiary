﻿using SwashbucklerDiary.Rcl.Extensions;
using SwashbucklerDiary.Rcl.Layout;
using System.Reflection;

namespace SwashbucklerDiary.WebAssembly.Essentials
{
    public class NavigateService : Rcl.Essentials.NavigateService
    {
        protected override Assembly[] Assemblies => [typeof(MainLayoutBase).Assembly, typeof(App).Assembly];

        protected override async Task HandleNavigateToStackBottomUri()
        {
            var length = await _jSRuntime.HistoryLength();
            if (length > 2)
            {
                await _jSRuntime.HistoryGo(-2);
            }
        }
    }
}
