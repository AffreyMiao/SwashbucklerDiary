﻿using Masa.Blazor;
using Microsoft.AspNetCore.Components;

namespace SwashbucklerDiary.Rcl.Components
{
    public abstract class FocusDialogComponentBase : ShowContentDialogComponentBase
    {
        protected MTextField<string?> textField = default!;

        protected override async Task AfterShowContent(bool isLazyContent)
        {
            await base.AfterShowContent(isLazyContent);

            await FocusAsync();
        }

        protected async Task FocusAsync()
        {
            if (textField != null && !textField.IsFocused)
            {
                await textField.InputElement.FocusAsync();
            }
        }
    }
}
