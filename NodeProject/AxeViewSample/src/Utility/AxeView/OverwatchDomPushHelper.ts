import { AxeViewDomInterface, AxeViewDomType } from "./AxeViewDomInterface";
import { Overwatch } from "./Overwatch";
import { OverwatchingOutputType, OverwatchingType } from "./OverwatchingType";

/** 감시 대상 돔 추가 도우미  */
export class OverwatchDomPushHelper
{
    constructor()
    {

    }

    /** 지금 처리중인 감시대상 */
    private _MyOw?: Overwatch = null;

    /** 지금 처리중인 감시대상 받기 */
    public get MyOw(): Overwatch
    {
        return this._MyOw;
    }

    /**
     * 지금 처리중인 감시대상 설정
     * @param myOw
     */
    public OverwatchSet(myOw: Overwatch): void
    {
        this._MyOw = myOw;
    }


    /**
     * 연결된 돔 추가 - Element
     * @param domPushData
     */
    public Dom_Push_Element(domPushData: Element)
    {
        this.Dom_Push_HTMLElement(domPushData as HTMLElement);
    }
    /**
     * 연결된 돔 추가 - HTMLElement
     * @param domPushData
     */
    public Dom_Push_HTMLElement(domPushData: HTMLElement)
    {
        this._MyOw.Dom_AxeView.push({
            AxeViewDomType: AxeViewDomType.HTMLElement
            , Dom: domPushData
            , EventName: null
        });
    }
    /**
     * 연결된 돔 추가 - Node
     * @param domPushData
     */
    public Dom_Push_Node(domPushData: Node)
    {
        this._MyOw.Dom_AxeView.push({
            AxeViewDomType: AxeViewDomType.Node
            , Dom: domPushData
            , EventName: null
        });
    }

    /**
     * 연결된 돔 추가 - Dom
     * 돔 개체 형식의 경우 부모는 무조건 하나다.
     * 
     * 2023-07-04 : 돔 교체를 지원하기 위해 모니터링에 추가함
     * @param domPushData
     */
    public Dom_Push_Dom(domPushData: HTMLElement)
    {
        //초기돔을 임시저장하고
        this._MyOw.Temp = this._MyOw.data;
        //새로 생성한 돔을 넣는다.
        this._MyOw.DataNow = domPushData;

        //돔개체 전용
        this._MyOw.DomIs = true;

        this._MyOw.Dom_AxeView.push({
            AxeViewDomType: AxeViewDomType.Dom
            , Dom: domPushData
            , EventName: null
        });
    }

    /**
     * 연결된 돔 추가 - 값없는 속성
     * 이 함수를 호출하기전에 속성의 이름을 이 감시자가 가지고 있는 값으로 변경해야 한다.
     * @param domPushData
     */
    public Dom_Push_Valueless(domPushData: ChildNode)
    {
        this._MyOw.Dom_AxeView.push({
            AxeViewDomType: AxeViewDomType.Attr_Valueless
            , Dom: domPushData
            , EventName: null
        });
    }

    /**
     * 연결된 돔 추가 - 혼자 값을 사용하는 경우
     * 전체 데이터를 변경한다.
     * @param domPushData
     */
    public Dom_Push_OneValue(domPushData: Attr)
    {
        this._MyOw.Dom_AxeView.push({
            AxeViewDomType: AxeViewDomType.Attr_OneValue
            , Dom: domPushData
            , EventName: null
        });
    }

    /**
     * 연결된 돔 추가 - 다른 값이 있어 리플레이스 하는 경우
     * 감시자외의 다른값이 있다면 변환(리플레이스)로 처리해야 한다.
     * 이때 같은 값이 있으면 오작동 할 수 있다.
     * @param domPushData
     */
    public Dom_Push_ReplaceValue(domPushData: Attr)
    {
        this._MyOw.Dom_AxeView.push({
            AxeViewDomType: AxeViewDomType.Attr_ReplaceValue
            , Dom: domPushData
        });
    }

    /**
     * 이벤트
     * @param domPushData 이 이벤트를 가지고 있는 부모돔
     * @param sEventName
     * @param bPush dom리스트에 추가할지 여부
     */
    public Dom_Push_Event(
        domPushData: ChildNode
        , sEventName: string
        , bPush: boolean)
    {
        let objThis: Overwatch = this._MyOw;

        //이름 처리
        if (OverwatchingOutputType.Function_NameRemoveOn === this._MyOw.OverwatchingOutputType)
        {//이름 앞에 'on'을 뺀다.

            if (2 <= sEventName.length)
            {//이름 길이가 충분하다

                if ("on" === sEventName.substring(0, 2).toLowerCase())
                {//앞에 두글자가 'on'이다.

                    //2뒤에 글자만 추출
                    sEventName = sEventName.substring(2);
                }
            }
        }

        //돔에 추가할 액스뷰 돔형식 생성
        let avdTemp: AxeViewDomInterface = {
            AxeViewDomType: AxeViewDomType.Attr_Event
            , Dom: domPushData
            , EventName: sEventName
        };

        //이벤트로 사용할 함수
        let funDom = function (event: Event)
        {
            (objThis.data as Function)(event, avdTemp.Dom, objThis);
        };

        avdTemp.Event = funDom;

        if (true === bPush)
        {
            this._MyOw.Dom_AxeView.push(avdTemp);
        }

        //이벤트 리스너에 등록
        (avdTemp.Dom as Node).removeEventListener(sEventName, avdTemp.Event);
        (avdTemp.Dom as Node).addEventListener(sEventName, avdTemp.Event);
    }

    /**
     * 연결된 돔 추가 - 값 모니터링 전용
     * 이 경우 하나의 돔만 감시할 수 있으므로 맨처음 적중한 한개 만 추가되고 나머지는 무시된다.
     * @param domPushData
     */
    public Dom_Push_Attr_ValueMonitoring(domPushData: ChildNode)
    {
        if (0 === this._MyOw.Dom_AxeView.length)
        {
            let objThis = this._MyOw;

            let avdTemp: AxeViewDomInterface;

            switch (objThis.OverwatchingType)
            {
                case OverwatchingType.Monitoring_AttrValue_Input:
                    //액스 돔으로 사용할 개체 만들기
                    avdTemp = {
                        AxeViewDomType: AxeViewDomType.Attr_ValueMonitoring
                        , Dom: domPushData
                        , EventName: "input"
                        , Event: function (event: Event)
                        {
                            objThis.data = this.value;
                        }
                    };
                    break;

                default:
                    //액스 돔으로 사용할 개체 만들기
                    avdTemp = {
                        AxeViewDomType: AxeViewDomType.Attr_ValueMonitoring
                        , Dom: domPushData
                        , EventName: "change"
                        , Event: function (event: Event)
                        {
                            objThis.data = this.value;
                        }
                    };
                    break;
            }



            //액스돔 리스트에 추가
            objThis.Dom_AxeView.push(avdTemp);

            this._MyOw.ValueMonitoringIs = true;

            //체인지 이벤트 추가
            (avdTemp.Dom as Node).removeEventListener(avdTemp.EventName, avdTemp.Event);
            (avdTemp.Dom as Node).addEventListener(avdTemp.EventName, avdTemp.Event);
        }
    }
}

