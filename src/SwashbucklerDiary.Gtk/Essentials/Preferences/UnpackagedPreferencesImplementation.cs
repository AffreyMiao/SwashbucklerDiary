using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;
using PreferencesDictionary = System.Collections.Concurrent.ConcurrentDictionary<string, System.Collections.Concurrent.ConcurrentDictionary<string, string>>;
using ShareNameDictionary = System.Collections.Concurrent.ConcurrentDictionary<string, string>;

namespace SwashbucklerDiary.Gtk.Essentials
{
    // from https://github.com/dotnet/maui/blob/main/src/Essentials/src/Preferences/Preferences.uwp.cs
    public class UnpackagedPreferencesImplementation
    {
        static readonly string AppPreferencesPath = Path.Combine(FileSystem.AppDataDirectory, "..", "Settings", "preferences.dat");

        readonly PreferencesDictionary _preferences = new();

        public UnpackagedPreferencesImplementation()
        {
            Load();

            _preferences.GetOrAdd(string.Empty, _ => new ShareNameDictionary());
        }

        public bool ContainsKey(string key, string sharedName = null)
        {
            if (_preferences.TryGetValue(CleanSharedName(sharedName), out var inner))
            {
                return inner.ContainsKey(key);
            }

            return false;
        }

        public void Remove(string key, string sharedName = null)
        {
            if (_preferences.TryGetValue(CleanSharedName(sharedName), out var inner))
            {
                inner.TryRemove(key, out _);
                Save();
            }
        }

        public void Clear(string sharedName = null)
        {
            if (_preferences.TryGetValue(CleanSharedName(sharedName), out var prefs))
            {
                prefs.Clear();
                Save();
            }
        }

        public void Set<T>(string key, T value, string sharedName = null)
        {
            CheckIsSupportedType<T>();

            var prefs = _preferences.GetOrAdd(CleanSharedName(sharedName), _ => new ShareNameDictionary());

            if (value is null)
                prefs.TryRemove(key, out _);
            else if (value is DateTime dt)
                prefs[key] = string.Format(CultureInfo.InvariantCulture, "{0}", dt.ToBinary());
            else if (value is DateTimeOffset dto)
                prefs[key] = dto.ToString("O");
            else
                prefs[key] = string.Format(CultureInfo.InvariantCulture, "{0}", value);

            Save();
        }

        public T Get<T>(string key, T defaultValue, string sharedName = null)
        {
            if (_preferences.TryGetValue(CleanSharedName(sharedName), out var inner))
            {
                if (inner.TryGetValue(key, out var value) && value is not null)
                {
                    if (defaultValue is DateTime dt)
                    {
                        // long for the .NET 9+ format
                        if (long.TryParse(value, CultureInfo.InvariantCulture, out var longValue))
                            return (T)(object)DateTime.FromBinary(longValue);
                        // DateTime string for the .NET 8 format
                        if (DateTime.TryParse(value, CultureInfo.InvariantCulture, out var datetimeValue))
                            return (T)(object)datetimeValue;
                    }
                    else if (defaultValue is DateTimeOffset dto)
                    {
                        if (DateTimeOffset.TryParse((string)value, CultureInfo.InvariantCulture, out var dateTimeOffset))
                        {
                            return (T)(object)dateTimeOffset;
                        }
                    }

                    try
                    {
                        return (T)Convert.ChangeType(value, typeof(T), CultureInfo.InvariantCulture);
                    }
                    catch (FormatException)
                    {
                        // bad get, fall back to default
                    }
                }
            }

            return defaultValue;
        }

        void Load()
        {
            if (!File.Exists(AppPreferencesPath))
                return;

            try
            {
                using var stream = File.OpenRead(AppPreferencesPath);

                PreferencesDictionary readPreferences = JsonSerializer.Deserialize(stream, PreferencesJsonSerializerContext.Default.PreferencesDictionary);

                if (readPreferences != null)
                {
                    _preferences.Clear();
                    foreach (var pair in readPreferences)
                        _preferences.TryAdd(pair.Key, pair.Value);
                }
            }
            catch (JsonException)
            {
                // if deserialization fails proceed with empty settings
            }
        }

        void Save()
        {
            var dir = Path.GetDirectoryName(AppPreferencesPath);
            Directory.CreateDirectory(dir);

            using var stream = File.Create(AppPreferencesPath);
            JsonSerializer.Serialize(stream, _preferences, PreferencesJsonSerializerContext.Default.PreferencesDictionary);
        }

        static string CleanSharedName(string sharedName) =>
            string.IsNullOrEmpty(sharedName) ? string.Empty : sharedName;

        internal static Type[] SupportedTypes = new Type[]
        {
            typeof(string),
            typeof(int),
            typeof(bool),
            typeof(long),
            typeof(double),
            typeof(float),
            typeof(DateTime),
            typeof(DateTimeOffset)
        };

        internal static void CheckIsSupportedType<T>()
        {
            var type = typeof(T);
            if (!SupportedTypes.Contains(type))
            {
                throw new NotSupportedException($"Preferences using '{type}' type is not supported");
            }
        }
    }
}

[JsonSerializable(typeof(PreferencesDictionary), TypeInfoPropertyName = nameof(PreferencesDictionary))]
internal partial class PreferencesJsonSerializerContext : JsonSerializerContext
{
}
