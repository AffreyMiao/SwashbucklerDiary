﻿using Microsoft.AspNetCore.Components.WebView;
using Microsoft.Web.WebView2.Core;
using SwashbucklerDiary.Utilities;
using System.Runtime.InteropServices.WindowsRuntime;
using Windows.Storage.Streams;

namespace SwashbucklerDiary
{
    public partial class MainPage
    {
        private partial void BlazorWebViewInitializing(object? sender, BlazorWebViewInitializingEventArgs e)
        {
        }

        private partial void BlazorWebViewInitialized(object? sender, BlazorWebViewInitializedEventArgs e)
        {
            var webview2 = e.WebView.CoreWebView2;
            webview2.WebResourceRequested += WebView2WebResourceRequested;
        }

        async void WebView2WebResourceRequested(CoreWebView2 webview2, CoreWebView2WebResourceRequestedEventArgs args)
        {
            await HandleAppDataRequest(webview2, args);
        }

        async Task HandleAppDataRequest(CoreWebView2 webview2, CoreWebView2WebResourceRequestedEventArgs args)
        {
            string path = new Uri(args.Request.Uri).AbsolutePath.TrimStart('/');
            if (!path.StartsWith("appdata/"))
            {
                return;
            }
            else
            {
                path = path.TrimStart("appdata/".ToCharArray());
            }

            //path = path.Replace("/", "\\");
            path = Path.Combine(FileSystem.AppDataDirectory, path);
            if (File.Exists(path))
            {
                using var contentStream = File.OpenRead(path);
                IRandomAccessStream stream = await CopyContentToRandomAccessStreamAsync(contentStream);
                var headers = GetResponseHeaders(args, path);
                var headerString = GetHeaderString(headers);
                var response = webview2.Environment.CreateWebResourceResponse(stream, 200, "OK", headerString);
                args.Response = response;
            }
            else
            {
                var response = webview2.Environment.CreateWebResourceResponse(null, 404, "Not Found", string.Empty);
                args.Response = response;
            }

            static string GetHeaderString(IDictionary<string, string> headers) =>
            string.Join(Environment.NewLine, headers.Select(kvp => $"{kvp.Key}: {kvp.Value}"));

            static async Task<IRandomAccessStream> CopyContentToRandomAccessStreamAsync(Stream content)
            {
                using var memStream = new MemoryStream();
                await content.CopyToAsync(memStream);
                var randomAccessStream = new InMemoryRandomAccessStream();
                await randomAccessStream.WriteAsync(memStream.GetWindowsRuntimeBuffer());
                return randomAccessStream;
            }

            static IDictionary<string, string> GetResponseHeaders(CoreWebView2WebResourceRequestedEventArgs args, string path)
            {
                var contentType = StaticContentProvider.GetResponseContentTypeOrDefault(path);
                var headers = StaticContentProvider.GetResponseHeaders(contentType);
                var fileInfo = new FileInfo(path);
                var length = fileInfo.Length;
                headers.Add("Content-Length", length.ToString());

                //适用于音频视频文件资源的响应
                bool isAny = args.Request.Headers.Contains("Range");
                if (isAny)
                {
                    var range = args.Request.Headers.GetHeader("Range");
                    var startIndex = Convert.ToInt64(range.TrimStart("bytes=".ToCharArray()).TrimEnd('-'));
                    string lastModifiedHex = fileInfo.LastWriteTimeUtc.Ticks.ToString("x");
                    string contentLengthHex = fileInfo.Length.ToString("x");

                    headers.Add("Accept-Ranges", "bytes");
                    headers.Add("Content-Range", $"bytes {startIndex}-{length - 1}/{length}");
                    headers.Add("ETag", $"{lastModifiedHex}-{contentLengthHex}");
                }

                return headers;
            }
        }
    }
}
