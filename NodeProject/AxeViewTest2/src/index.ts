import AxeView, { Overwatch, OverwatchInterface, OverwatchingOutputType, OverwatchingType } from "./AxeView/AxeView";

import testStartUp from "./testStartUp";
import testBasicSample from "./testBasicSample";

export default class App
{
	//지금 보여주고 있는 페이지에서 사용할 개체
	PageNow: any = null;

	constructor()
	{
		//파일명으로 라우터 처럼 동작하게 해준다.
		let arrPath = window.location.pathname.split("/");

		switch (arrPath[arrPath.length-1])
		{
			case "index.html":
				break;

			case "testStartUp.html":
				this.PageNow = new testStartUp();
				break;

			case "testBasicSample.html":
				this.PageNow = new testBasicSample();
				break;
		}
	}
}

const app = new App();

