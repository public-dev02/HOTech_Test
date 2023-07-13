interface InferredOptions
{
    NestedParse: boolean;
}

export default class PrintInferredTypes
{
    private Options: InferredOptions = {
        NestedParse: true
    };

    /**
     * PrintInferredTypes 클래스의 생성자.
     * @param json 변환할 JSON 객체.
     */
    constructor(options?: InferredOptions)
    {
        if (options)
        {
            this.Options = options;
        }
    }

    public Parse<T>(json: any): T
    {
        return this.ParseObject(json);
    }

    /**
     * 주어진 객체를 파싱하여 원하는 형식으로 변환.
     * @param obj 변환할 객체.
     * @returns 변환된 객체.
     */
    private ParseObject(object: any): any
    {
        if ('object' === typeof object && object !== null)
        {
            // 변환된 객체를 담을 객체 생성
            const Parsed: any = {};

            // object의 key를 순회하며, 각 key에 대한 value를 ParseValue 함수를 통해 변환.
            for (const key in object)
            {
                if (object.hasOwnProperty(key))
                {
                    Parsed[key] = this.ParseValue(object[key]);
                }
            }

            // 변환된 객체 반환.
            return Parsed;
        }
        else
        {
            // object가 object가 아니면 그냥 반환.
            return object;
        }
    }

    /**
     * 주어진 값의 타입을 검사하고, 원하는 형식으로 변환.
     * @param value 변환할 값.
     * @returns 변환된 값.
     */
    private ParseValue(value: any): any
    {
        // value의 타입을 검사하고, 원하는 형식으로 변환.

        if ("string" === typeof value)
        {
            // 맨 앞과 맨 뒤에 작은 따옴표가 있다면 제거
            if (value[0] === "'" && value[value.length - 1] === "'")
            {
                value = value.slice(1, value.length - 1);
            }

            if (value === "true" || value === "false")
            {
                // value가 string이면서, true/false면 boolean으로 변환.
                return value === "true";
            }
            else if (!Number.isNaN(Number(value)))
            {
                // value가 string이면서, true/false도 아니고, 숫자면 숫자로 변환.
                return Number(value);
            }
            else if (this.IsJsonString(value) && this.Options.NestedParse)
            {
                // value가 string이면서, true/false도 아니고, 숫자도 아니면서
                // JSON string이면 JSON으로 변환.
                return this.ParseObject(JSON.parse(value));
            }
            else
            {
                // value가 string이면서, true/false도 아니고, 숫자도 아니면서
                // JSON string도 아니라면 그냥 반환.
                return value;
            }
        }
        else
        {
            // value가 string도 아니고, object도 아니면 그냥 반환.
            return value;
        }
    }

    public IsJsonString(str: string): boolean
    {
        try
        {
            JSON.parse(str);
            return true;
        }
        catch (e)
        {
            return false;
        }
    }
}