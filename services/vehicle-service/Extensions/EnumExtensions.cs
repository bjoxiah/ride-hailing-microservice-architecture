using System.Reflection;
using System.Runtime.Serialization;

namespace VehicleService.Extensions;

public static class EnumExtensions
{
    public static string GetEnumMemberValue<T>(this T enumValue) where T : Enum
    {
        var type = enumValue.GetType();
        var memberInfo = type.GetMember(enumValue.ToString());
        
        if (memberInfo.Length > 0)
        {
            var attribute = memberInfo[0].GetCustomAttribute<EnumMemberAttribute>();
            if (attribute != null)
            {
                return attribute.Value ?? enumValue.ToString();
            }
        }
        
        return enumValue.ToString();
    }
}