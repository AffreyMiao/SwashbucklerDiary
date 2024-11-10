﻿using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Components;
using SwashbucklerDiary.Rcl.Services;
using SwashbucklerDiary.Shared;

namespace SwashbucklerDiary.Rcl.Components
{
    public partial class SelectLocationDialog : DialogComponentBase
    {
        private bool showAdd;

        private bool showSearch;

        private string? _searchText;

        private string? selectedLocation;

        private List<LocationModel> internalItems = [];

        private readonly List<LocationModel> defaultItems = [];

        [Inject]
        ILocationService LocationService { get; set; } = default!;

        [CascadingParameter(Name = "IsDark")]
        public bool Dark { get; set; }

        [Parameter]
        public string? Value { get; set; }

        [Parameter]
        public EventCallback<string> ValueChanged { get; set; }

        [Parameter]
        public List<LocationModel> Items { get; set; } = [];

        [Parameter]
        public EventCallback<List<LocationModel>> ItemsChanged { get; set; }

        protected override void OnInitialized()
        {
            base.OnInitialized();

            Items = defaultItems;
        }

        protected override async Task OnAfterRenderAsync(bool firstRender)
        {
            await base.OnAfterRenderAsync(firstRender);

            if (firstRender)
            {
                if (Items == defaultItems)
                {
                    Items = await LocationService.QueryAsync();
                    UpdateInternalItems(_searchText);
                    StateHasChanged();
                }
            }
        }

        private string? Color => Dark ? "white" : "grey";

        private void BeforeShowContent()
        {
            _searchText = string.Empty;
            selectedLocation = Value;
            internalItems = Items;
        }

        private void SetSelectedLocation(LocationModel location)
        {
            selectedLocation = selectedLocation == location.Name ? null : location.Name;
        }

        private async Task SaveAdd(string name)
        {
            showAdd = false;
            StateHasChanged();

            if (string.IsNullOrWhiteSpace(name))
            {
                return;
            }

            if (Items.Any(it => it.Name == name))
            {
                await PopupServiceHelper.Warning(I18n.T("Location.Repeat.Title"), I18n.T("Location.Repeat.Content"));
                return;
            }

            LocationModel location = new(name);
            var flag = await LocationService.AddAsync(location);
            if (!flag)
            {
                await PopupServiceHelper.Error(I18n.T("Share.AddFail"));
                return;
            }

            Items.Insert(0, location);
            selectedLocation = location.Name;
            UpdateInternalItems(_searchText);
            StateHasChanged();
        }

        private async Task HandleOnOK()
        {
            await InternalVisibleChanged(false);
            Value = selectedLocation;
            if (ValueChanged.HasDelegate)
            {
                await ValueChanged.InvokeAsync(selectedLocation);
            }
        }

        private void UpdateInternalItems(string? searchText)
        {
            if (string.IsNullOrWhiteSpace(searchText))
            {
                internalItems = Items;
            }
            else
            {
                internalItems = Items.Where(it => !string.IsNullOrEmpty(it.Name) && (it.Name.Contains(searchText) || it.Name == selectedLocation)).ToList();
            }
        }
    }
}
