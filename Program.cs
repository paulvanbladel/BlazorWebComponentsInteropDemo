using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using Microsoft.AspNetCore.Components.Web;
using BlazorWebComponentsInteropDemo;
using BlazorWebComponentsInteropDemo.Components;

var builder = WebAssemblyHostBuilder.CreateDefault(args);

// Add a root component to enable the Blazor app - this enables dynamic root components
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// Register component type for the JS Render API (id: "rich")  
builder.RootComponents.RegisterForJavaScript<RichWidget>("rich", "initializeComponent");

await builder.Build().RunAsync();
