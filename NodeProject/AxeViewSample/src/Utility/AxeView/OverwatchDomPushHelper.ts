import { AxeViewDomInterface, AxeViewDomType } from "./AxeViewDomInterface";
import { Overwatch } from "./Overwatch"
import { OverwatchingOutputType, OverwatchingType } from "./OverwatchingType"

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
	 * @param sMatchString 추출된 문자열 그대로
	 */
	public Dom_Push_Element(
		domPushData: Element
		, sMatchString: string)
	{
		this.Dom_Push_HTMLElement(
			domPushData as HTMLElement
			, sMatchString);
	}
	/**
	 * 연결된 돔 추가 - HTMLElement
	 * @param domPushData
	 * @param sMatchString 추출된 문자열 그대로
	 */
	public Dom_Push_HTMLElement(
		domPushData: HTMLElement
		, sMatchString: string)
	{

		//전달된 문자열을 json으로 바꾼다.
		let jsonOpt: { [key: string]: string } = this.MatchToTossOpt(sMatchString);

		
		this._MyOw.Dom_AxeView.push({
			AxeViewDomType: AxeViewDomType.HTMLElement
			, Dom: domPushData
			, EventName: null
			, TossOption: jsonOpt
			//, TossOption2: <T>(): T => { return jsonOpt as T }
			, TossOption2: <T>(): T => { return this.GetOption(jsonOpt); }
		});
	}
	/**
	 * 연결된 돔 추가 - Node
	 * @param domPushData
	 * @param sMatchString 추출된 문자열 그대로
	 */
	public Dom_Push_Node(
		domPushData: Node
		, sMatchString: string)
	{
		//전달된 문자열을 json으로 바꾼다.
		let jsonOpt: { [key: string]: string } = this.MatchToTossOpt(sMatchString);

		this._MyOw.Dom_AxeView.push({
			AxeViewDomType: AxeViewDomType.Node
			, Dom: domPushData
			, EventName: null
			, TossOption: jsonOpt
			, TossOption2: <T>(): T => { return this.GetOption(jsonOpt); }
		});
	}

	/**
	 * 연결된 돔 추가 - Dom
	 * 돔 개체 형식의 경우 부모는 무조건 하나다.
	 * 
	 * 2023-07-04 : 돔 교체를 지원하기 위해 모니터링에 추가함
	 * @param domPushData
	 */
	public Dom_Push_Dom(
		domPushData: HTMLElement
		, sMatchString: string)
	{
		//초기돔을 임시저장하고
		this._MyOw.Temp = this._MyOw.data;
		//새로 생성한 돔을 넣는다.
		this._MyOw.DataNow = domPushData;

		//돔개체 전용
		this._MyOw.DomIs = true;

		//전달된 문자열을 json으로 바꾼다.
		let jsonOpt: { [key: string]: string } = this.MatchToTossOpt(sMatchString);

		this._MyOw.Dom_AxeView.push({
			AxeViewDomType: AxeViewDomType.Dom
			, Dom: domPushData
			, EventName: null
			, TossOption: jsonOpt
			, TossOption2: <T>(): T => { return this.GetOption(jsonOpt); }
		});
	}

	/**
	 * 연결된 돔 추가 - 값없는 속성
	 * 이 함수를 호출하기전에 속성의 이름을 이 감시자가 가지고 있는 값으로 변경해야 한다.
	 * @param domPushData
	 * @param sMatchString 추출된 문자열 그대로
	 */
	public Dom_Push_Valueless(
		domPushData: ChildNode
		, sMatchString: string)
	{
		//전달된 문자열을 json으로 바꾼다.
		let jsonOpt: { [key: string]: string } = this.MatchToTossOpt(sMatchString);

		this._MyOw.Dom_AxeView.push({
			AxeViewDomType: AxeViewDomType.Attr_Valueless
			, Dom: domPushData
			, EventName: null
			, TossOption: jsonOpt
			, TossOption2: <T>(): T => { return this.GetOption(jsonOpt); }
		});
	}

	/**
	 * 연결된 돔 추가 - 혼자 값을 사용하는 경우
	 * 전체 데이터를 변경한다.
	 * @param domPushData
	 * @param sMatchString 추출된 문자열 그대로
	 */
	public Dom_Push_OneValue(
		domPushData: Attr
		, sMatchString: string)
	{
		//전달된 문자열을 json으로 바꾼다.
		let jsonOpt: { [key: string]: string } = this.MatchToTossOpt(sMatchString);

		this._MyOw.Dom_AxeView.push({
			AxeViewDomType: AxeViewDomType.Attr_OneValue
			, Dom: domPushData
			, EventName: null
			, TossOption: jsonOpt
			, TossOption2: <T>(): T => { return this.GetOption(jsonOpt); }
		});
	}

	/**
	 * 연결된 돔 추가 - 다른 값이 있어 리플레이스 하는 경우
	 * 감시자외의 다른값이 있다면 변환(리플레이스)로 처리해야 한다.
	 * 이때 같은 값이 있으면 오작동 할 수 있다.
	 * @param domPushData
	 * @param sMatchString 추출된 문자열 그대로
	 */
	public Dom_Push_ReplaceValue(
		domPushData: Attr
		, sMatchString: string)
	{
		//전달된 문자열을 json으로 바꾼다.
		let jsonOpt: { [key: string]: string } = this.MatchToTossOpt(sMatchString);

		this._MyOw.Dom_AxeView.push({
			AxeViewDomType: AxeViewDomType.Attr_ReplaceValue
			, Dom: domPushData
			, TossOption: jsonOpt
			, TossOption2: <T>(): T => { return this.GetOption(jsonOpt); }
		});
	}

	/**
	 * 이벤트
	 * @param domPushData 이 이벤트를 가지고 있는 부모돔
	 * @param sMatchString 추출된 문자열 그대로
	 * @param sEventName
	 * @param bPush dom리스트에 추가할지 여부
	 */
	public Dom_Push_Event(
		domPushData: ChildNode
		, sMatchString: string
		, sEventName: string
		, bPush: boolean)
	{
		let objThis: Overwatch = this._MyOw;

		//전달된 문자열을 json으로 바꾼다.
		let jsonOpt: { [key: string]: string } = this.MatchToTossOpt(sMatchString);

		//이름 처리
		if (OverwatchingOutputType.Function_NameRemoveOn
				=== this._MyOw.OverwatchingOutputType)
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
			, TossOption: jsonOpt
			, TossOption2: <T>(): T => { return this.GetOption(jsonOpt); }
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
	 * @param sMatchString 추출된 문자열 그대로
	 */
	public Dom_Push_Attr_ValueMonitoring(
		domPushData: ChildNode
		, sMatchString: string)
	{
		if (0 === this._MyOw.Dom_AxeView.length)
		{
			let objThis = this._MyOw;

			let avdTemp: AxeViewDomInterface;

			//전달된 문자열을 json으로 바꾼다.
			let jsonOpt: { [key: string]: string } = this.MatchToTossOpt(sMatchString);

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
						, TossOption: jsonOpt
						, TossOption2: <T>(): T => { return this.GetOption(jsonOpt); }
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
						, TossOption: jsonOpt
						, TossOption2: <T>(): T => { return this.GetOption(jsonOpt); }
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

	/**
	 * 매칭으로 추출된 문자열을 자르고 감시대상에 있는 
	 * 전달 옵션과 합쳐 리턴한다.
	 * @param sMatchString
	 * @returns
	 */
	private MatchToTossOpt(sMatchString: string): { [key: string]: string }
	{
		let jsonReturn: { [key: string]: string } = {};
		

		if ("" === sMatchString
			|| null === sMatchString
			|| undefined === sMatchString)
		{//옵션이 없다.

			//감시대상에 등록된 옵션만 사용함
			jsonReturn = this.MyOw.TossOption;
		}
		else
		{
			//구분자를 기준으로 데이터를 자른다.
			let arrDataString: string[] = sMatchString.split("<");

			if (1 < arrDataString.length)
			{//잘린 데이터가 있으면

				//전달된 옵션 만 자르기
				let arrDataCut
					= arrDataString[1]
						.substring(0, arrDataString[1].length - 2)
						.split(",");

				let jsonTemp: JSON = JSON.parse("{}");

				for (let i = 0; i < arrDataCut.length; ++i)
				{
					let item = arrDataCut[i];
					//구분자로 키와 데이터를 분리한다.
					let itemCut = item.split(":");

					if (2 <= itemCut.length)
					{//잘린 개수가 2개 이상이다.

						//첫번째는 무조건 키고
						//나머지는 값이다.
						//맨앞에 콜론(:)은 넣지 않기위해 +1 한다.
						jsonTemp[itemCut[0]]
							= item.substring(itemCut[0].length + 1);
					}
				}//end for i


				//기본값과 합치기
				jsonReturn = Object.assign(this.MyOw.TossOption, jsonTemp);
			}
		}

		return jsonReturn;
	}

	private GetOption = <T>(json):T =>
	{
		return json as T;
	}
}

