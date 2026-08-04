program oddballz_for_windows;

{ Oddballz (C) 1992 Fred Kohler & Brian Semotiuk
	Windows version (C) 1992 Brian Semotiuk
}

{$R oddballz.res }
{$D Oddballz for Windows (C) 1992 Brian Semotiuk }
uses WinTypes, WinProcs, Odialogs, OWindows, Objects, OddUnit, BWCC, LoadBMP, mmsystem;

const
	id_oddmenu = 100;
	cm_OddPlayRows = 101;
	cm_OddPlayCol = 102;
	cm_OddPause = 103;
	cm_OddStop = 104;
	cm_OddInstr = 105;
	cm_OddAbout = 106;
	cm_OddSound = 107;
	cm_HighScores = 108;
	cm_StartGame = 109;
	cm_MIDI = 110;
	cm_WAVE = 111;

	id_Icon = 'ODDBALLZ'; { Menu resource id name for icon }
	id_AboutDialog = 200;
	id_CloseDialog = 201;
	id_LostDialog = 203;
	id_EnterHSDialog = 204;
	id_ViewHSDialog = 205;
	id_Timer = 1;

	Palsize: integer = 16;

type

{ Declare an object type descended from TApplication and override InitMainWindow Method }

	POddApplication = ^OddApplication;
	OddApplication = object(TApplication)
		procedure InitMainWindow; virtual;
		procedure InitInstance; virtual;
	end;
{ Declare an object descended from TWindow
}
	POddWindow = ^OddWindow;

	OddWindow = object(TWindow)
		OddLogPalette: PLogPalette;
		intro: Boolean;
		constructor Init(AParent: PWindowsObject; ATitle: PChar);
		destructor Done;
			virtual;
		procedure GetWindowClass(var AWndClass: TWndClass);
			virtual;
		procedure SetupWindow;
    	virtual;
		procedure WMDestroy (var Msg: TMessage);
			virtual wm_First + wm_Destroy;
		procedure OddPause(var Msg: TMessage);
			virtual cm_first + cm_OddPause;
		procedure ToggleSound(var Msg: TMessage);
			virtual cm_first + cm_OddSound;
		procedure ToggleMidi(var Msg: TMessage);
			virtual cm_first + cm_MIDI;
		procedure ToggleWave(var Msg: TMessage);
			virtual cm_first + cm_WAVE;
		procedure ViewHighScores(var Msg: TMessage);
			virtual cm_first + cm_HighScores;
		procedure About(var Msg: TMessage);
			virtual cm_first + cm_OddAbout;
		procedure Instructions(var Msg: TMessage);
			virtual cm_first + cm_OddInstr;
		procedure LostFocus(var Msg: TMessage);
			virtual wm_first + wm_KillFocus;
		procedure GotFocus(var Msg: TMessage);
			virtual wm_first + wm_SetFocus;
		procedure CheckTopTen;
			virtual;
		procedure StartGame(var Msg: TMessage);
			virtual	cm_first + cm_StartGame;
		procedure PlayRows(var Msg: TMessage);
			virtual cm_first + cm_OddPlayRows;
		procedure PlayCol(var Msg: TMessage);
			virtual cm_first + cm_OddPlayCol;
		procedure OddStop(var Msg: TMessage);
			virtual cm_first + cm_OddStop;
		procedure wmTimer(var Msg: TMessage);
			virtual wm_first + wm_Timer;
		procedure Paint(PaintDC: HDC; var PaintInfo: TPaintStruct);
			virtual;
		function CanClose: boolean;
			virtual;
	end;

{ *** OddApplication Methods *** }
{================================}

{ Initialize OddApplication object's window }
procedure OddApplication.InitMainWindow;
begin
	MainWindow := New(POddwindow, Init(nil, 'Oddballz'));
end;

procedure Oddapplication.InitInstance;
begin
	TApplication.InitInstance;
	HAccTable:= LoadAccelerators(HInstance, PChar(500));
	HAccel:= HAccTable; { copies handle to global var declared in oddbu }
	{ The reason is so the TranslateAccelerator API function has a handle to the Acc. Table }
end;

{ *** OddWindow Methods *** }
{===========================}

{ Construct OddWindow object }
constructor OddWindow.Init(AParent: PWindowsObject; ATitle: PChar);
var
	Ball,Height, Width, Color: integer;
	i		: word;
	DC: Hdc;
begin
	TWindow.Init(AParent, ATitle); { Perform default TWindow Stuff }

	DC:= GetDC(HWindow);
	ReleaseDC(HWindow,DC);

	Color:= GetDeviceCaps(DC, BITSPIXEL);

	if Color = 1 then
		begin
			DisplayColors:= 16;
			PalSize:= 16;
		end;

	if Color >= 8 then
		begin
			DisplayColors:= 256;
			PalSize:= 256;
		end;




{ Following adjusts the size of the playfield relative to the whole window size }
	Height:= GetSystemMetrics(sm_CYMenu) + GetSystemMetrics(sm_CYSize) +
	GetSystemMetrics(sm_CYBorder)*2 + 242;
	Width:= GetSystemMetrics(sm_CXBorder) *2 +320;
	with Attr do
	begin
		X := 100; Y:= 100; W := Width; H := Height;
		Style:= ws_Caption or ws_SysMenu or ws_MinimizeBox;
		Menu := LoadMenu(HInstance, PChar(id_oddmenu)); { Load in Menu Resources }
	end;
{ For the 256 color version, have to load in bitmaps separately, can't seem to load 256
	color bitmaps from a resource!}

	if DisplayColors = 256 then
		begin
			OddBallzShapes[0] := LoadBitmap('ball0256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[1] := loadBitmap('ball1256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[2] := loadBitmap('ball2256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[3] := loadBitmap('ball3256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[4] := loadBitmap('ball4256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[5] := loadBitmap('ball5256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[6] := loadBitmap('ball6256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[7] := loadBitmap('ballm256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[8] := loadBitmap('ballm256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);

			pausebitmap := LoadBitmap('pause256.bmp', HWindow, Pwidth, PHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			pausebitmapmask := LoadBitmap('pausem25.bmp', HWindow, Pwidth, PHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			introscrnBmp := LoadBitmap('intro256.bmp', HWindow, SWidth, SHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			PlayScreenBmp := LoadBitmap('play256.bmp', HWindow, SWidth, SHeight, OddBallzPalette);
		end;

{ IMPORTANT - You must delete the palette before loading another bitmap, only if you're using
	the same palette handle like I do here, in this case OddBallzPalette. I only need one palette
	for everything because all the bitmaps use the same palette but the LoadBitmap function
	requires a palette handle then creates a palette and copies it to the handle you send it.
	What happens if you don't delete it? The logical palette memory is still reserved by Windows
	but the OddBallzPalette handle that is passed to LoadBitmap is changed to a new handle
	pointing to an entirely new palette that gets created thus losing the old handle. When you
	call DeleteObject, it only deletes, in this case, the last palette assigned to
	OddBallzPalette and the system resources will go down. This was hard to find because I
	originally passed OddBallzPalette for each bitmap because I didn't need any more bitmaps
	created and thought it convenient to just keep passing the same Handle. It wasn't until I
	examined the LoadBitmap function closely which allowed me to come up with this fix. I was
	too lazy to rewrite the LoadBitmap function but this works fine.
}

	if DisplayColors = 16 then
		begin
			OddBallzShapes[0] := LoadBitmap('ball016.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[1] := loadBitmap('ball116.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[2] := loadBitmap('ball216.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[3] := loadBitmap('ball316.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[4] := loadBitmap('ball416.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[5] := loadBitmap('ball516.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[6] := loadBitmap('ball616.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			OddballzShapes[7] := loadBitmap('ballm256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			OddballzShapes[8] := loadBitmap('ballm256.bmp', HWindow, BWidth, BHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);

			pausebitmap := LoadBitmap('pause16.bmp', HWindow, Pwidth, PHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			pausebitmapmask := LoadBitmap('pausem25.bmp', HWindow, Pwidth, PHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			introscrnBmp := LoadBitmap('intro16.bmp', HWindow, SWidth, SHeight, OddBallzPalette);
			DeleteObject(OddBallzPalette);
			PlayScreenBmp := LoadBitmap('play16.bmp', HWindow, SWidth, SHeight, OddBallzPalette);
		end;

	enough:= True;
	endgame:= True;
	intro:= True; { Display Intro Screen at Startup }

	EnableMenuItem(Attr.Menu, cm_OddPlayRows, mf_ByCommand or mf_Enabled);
	EnableMenuItem(Attr.Menu, cm_MIDI, mf_ByCommand or mf_Grayed);
	EnableMenuItem(Attr.Menu, cm_OddPlayCol, mf_ByCommand or mf_Enabled);
	EnableMenuItem(Attr.Menu, cm_OddPause, mf_ByCommand or mf_Grayed);
	EnableMenuItem(Attr.Menu, cm_OddStop, mf_ByCommand or mf_Grayed);

	PlaySound:= False; {Set all sounds like this for now}
	Midi:= False;
	Wave:= False;
	Matcher:= True; { Default game to color matching }
	InitOBall;
end;


{ Destroy OddWindow object }
destructor OddWindow.Done;
var
	ball: integer;

begin
	for ball:= 0 to 6 do
		DeleteObject(OddballzShapes[ball]);

	DeleteObject(PlayScreenBmp);
	DeleteObject(pausebitmap);
	DeleteObject(introscrnbmp);

	DeleteObject(OddballzPalette);
	DeleteObject(OldPalette);

	PauseFlag:= False; {In case game paused when closed tells pauser in oddbu to quit loop}
	PauseQuit:=True;	{If the game was paused while closed, tells pauser to exit}
	Enough:= True; {Shut down the Oddballz Unit}
	LostFocusFlag:= False;
	EndGame:= False; {Tells StartGame method to halt if game was closed while playing}
	closesound;
	DC:= GetDC(HWindow);
	SetSystemPaletteUse(DC,syspal_Static);
	ReleaseDC(HWindow,DC);
	DestroyMenu(Attr.menu);
	KillTimer(HWindow, id_Timer);
	TWindow.Done;
end;


{ Modify window class to use custom icon }
procedure OddWindow.GetWindowClass(var AWndClass: TWndClass);
begin
	TWindow.GetWindowClass(AWndClass);
	AWndClass.HIcon:= LoadIcon(HInstance, id_Icon)
end;


{ Modify SetupWindow }
procedure OddWindow.SetupWindow;
var
	x: LongInt;
	timestr: string;
	timea,timeb: longint;

begin
	Oddwindows:= HWindow;
	TWindow.SetupWindow;

	MIDICAP:= TRUE;
	if mciSendString('open oddintro.mid alias intro',nil,0,0) <> 0 then
		begin
			MIDICAP:= FALSE;
		end;

	if mciSendString('open oddend.mid alias stopgame',nil,0,0) <> 0 then
		begin
			MIDICAP:= FALSE;
		end;
	if mciSendString('open oddplay.mid alias playgame',nil,0,0) <> 0 then
		begin
			MIDICAP:= FALSE;
		end;
	songname:= 'intro';
	lastsongname:= 'intro';

	if MIDICAP then {so mci device error box comes up before timer is started!}
			mciSendString('play intro from 0 to 0',nil,0,0);

		EnableMenuItem(Attr.Menu, cm_MIDI, mf_ByCommand or mf_Enabled);

	SetTimer(HWindow, id_Timer, 1000, NIL); {Timer to handle MIDI Playback}

	OpenSound;
	SetVoiceAccent(1,0,255,s_Normal,0);
end;


{ Intercept wm_Destroy message }
procedure OddWindow.WMDestroy(var Msg: TMessage);
begin
	TWindow.WMDestroy(Msg)
end;


{ Oddballz Pause }
procedure OddWindow.OddPause;
	var
	OldBitmap: HBitmap;
	i: integer;
	ABrush, OldBrush: HBrush;

begin
	OddWindows:= HWindow;
	if enough then exit;


	if (pauseflag) or (lostfocusflag) then
		begin
			OpenSound;
			SetVoiceAccent(1,0,255,s_Normal,0);

			EnableMenuItem(Attr.Menu, cm_OddStop, mf_ByCommand or mf_Enabled);
			CheckMenuItem(Attr.Menu, cm_OddPause, mf_Bycommand or mf_Unchecked);
			pauseflag:= false;
		end
	else
		begin
			closesound; { Close sound while game paused }
			EnableMenuItem(Attr.Menu, cm_OddStop, mf_ByCommand or mf_Grayed);
			CheckMenuItem(Attr.Menu, cm_OddPause, mf_Bycommand or mf_Checked);
			pauseflag:=true;
			pauser;
		end;

end;

{ Oddballz toggle sound }
procedure OddWindow.ToggleSound;
begin
	if PlaySound then
		begin
			CheckMenuItem(Attr.Menu, cm_OddSound, mf_ByCommand or mf_Unchecked);
			PlaySound:= False;
		end
  else
  	begin
			CheckMenuItem(Attr.Menu, cm_OddSound, mf_ByCommand or mf_Checked);
			PlaySound:= True;
		end;
end;

{ Oddballz toggle MIDI }
procedure OddWindow.ToggleMidi;
begin
	if NOT MIDICAP then exit;
	if MIDI then
		begin
			CheckMenuItem(Attr.Menu, cm_MIDI, mf_ByCommand or mf_Unchecked);
			MIDI:= False;
		end
  else
  	begin
			CheckMenuItem(Attr.Menu, cm_MIDI, mf_ByCommand or mf_Checked);
			MIDI:= True;
		end;
end;

{ Oddballz toggle sound }
procedure OddWindow.ToggleWave;
begin
	if WAVE then
		begin
			CheckMenuItem(Attr.Menu, cm_WAVE, mf_ByCommand or mf_Unchecked);
			WAVE:= False;
		end
  else
  	begin
			CheckMenuItem(Attr.Menu, cm_WAVE, mf_ByCommand or mf_Checked);
			WAVE:= True;
		end;
end;

{ Displays High Scores }
procedure Oddwindow.ViewHighScores(var Msg: TMessage);
type
	TopTenTransferList = record
		Name: string[255];
		Level: string[255];
		Skill: string[255];
		Score: string[255];
		GameType: string[20];
	end;

const
	NewLine = #13#10;

var
	D: PDialog;
	S1: PStatic;
	ReturnValue, counter: Integer;
	Name, temp: String[255];
	TTList: TopTenTransferList;

begin
	ValidScore := true;
	Assign(HiScore,'HISCORE.DAT');
	InitTop10;

	TTList.Name:='';
	TTList.Level:='';
	TTList.Skill:='';
	TTList.Score:='';

	if Matcher then TTList.GameType:= 'Color Matching' + Char(0) else
		TTList.GameType:= 'Row Building' + Char(0);
	if Matcher then Game := 1 else Game := 3;

	for counter:= 0 to 19 do
		TTList.GameType[counter]:= TTList.GameType[counter + 1];

{ The following creates big strings for each field, separating each number with a newline
}
	for counter:= 1 to 10 do
		begin
			Temp:= Top10[counter,Game].Name;
			TTList.Name:= TTList.Name + Temp + NewLine;

			Temp:= Int2Str(Top10[counter,Game].Level);
			TTList.Level:= TTList.Level + Temp + NewLine;

			Temp:= Int2Str(Top10[counter,Game].Skill);
			TTList.Skill:= TTList.Skill + Temp + NewLine;

			Temp:= Int2Str(Top10[counter,Game].Score);
      TTList.Score:= TTList.Score + Temp + NewLine;
		end;

{ The following converts the pascal strings to a null terminated string that Windows
	understands.
}
	TTList.Name:= TTList.Name + Char(0);
	TTList.Level:= TTList.Level + Char(0);
	TTList.Skill:= TTList.Skill + Char(0);
	TTList.Score:= TTList.Score + Char(0);
	for counter:= 0 to 254 do
		begin
			TTList.Name[counter]:= TTList.Name[counter + 1];
			TTList.Level[counter]:= TTList.Level[counter + 1];
			TTList.Skill[counter]:= TTList.Skill[counter + 1];
			TTList.Score[counter]:= TTList.Score[counter + 1];
		end;

	D:= (New(PDialog,Init(@Self, PChar(id_ViewHSDialog))));
	New(S1, InitResource(D, 2050, SizeOf(TTList.Name)));
	New(S1, InitResource(D, 2051, SizeOf(TTList.Level)));
	New(S1, InitResource(D, 2052, SizeOf(TTList.Skill)));
	New(S1, InitResource(D, 2053, SizeOf(TTList.Score)));
	New(S1, InitResource(D, 2054, SizeOf(TTList.GameType)));

	D^.TransferBuffer:= @TTList; { Set up the transfer buffer for the dialog }

	ReturnValue:= Application^.ExecDialog(D);
end;

{ Display About }
procedure OddWindow.About;
var
	D: PDialog;
	ReturnValue: Integer;

begin
	D:= (New(PDialog,Init(@Self, PChar(id_AboutDialog))));
	ReturnValue:= Application^.ExecDialog(D);
	{ Do nothing with ReturnValue ie. OK }
end;

procedure OddWindow.Instructions;
var
	temp: String;
begin
	WinHelp (Hwindow,'odd.hlp',HELP_INDEX,0);
end;

{ Oddballz lost focus }
procedure OddWindow.LostFocus(var Msg: TMessage);
begin
	OddWindows:= HWindow;
	InvalidateRect(HWindow,nil,False);
	if enough then exit; { exit if game over }

{		EnableMenuItem(Attr.Menu, cm_OddStop, mf_ByCommand or mf_Grayed);
}		if not GameOver then
		begin
			CheckMenuItem(Attr.Menu, cm_OddPause, mf_Bycommand or mf_Checked);
			EnableMenuItem(Attr.Menu, cm_OddStop, mf_Bycommand or mf_Grayed);
		end;
		lostfocusflag:= True; { lost the focus, so tell game ok to pause }

end;

{ Oddballz got focus }
procedure OddWindow.GotFocus;
begin
		InvalidateRect(HWindow,nil,False);

		SendMessage(HWindow, WM_PAINT, 0, 0); {Tells oddballz to repaint itself}
																					{Mainly for Palette restoration}

	if enough then exit;

	if not pauseflag then
	begin
(* The following is executed if the game wasn't paused due to the focus
		coming back too quickly (ie. minimizing another window quickly)
*)
		CheckMenuItem(Attr.Menu, cm_OddPause, mf_Bycommand or mf_Unchecked);
		if not endgame then
			EnableMenuItem(Attr.Menu, cm_OddStop, mf_Bycommand or mf_Enabled);
	end;

	lostfocusflag:= False; { go the focus back, so tell game not ok to pause }
end;


{ This procedure checks the top ten scores after the end of a game and, if the score is
	in the top ten, prompts the user to enter his/her name
}
procedure OddWindow.CheckTopTen;
const
	id_HSNameEdit = 2040;

var
	ipoint,
	i,j 		: byte;
	NameEdit: String[40];
	ErrorVal : integer;
	D: PDialog;
	E1: PEdit;
	temp		: word;

	function CheckInsert : byte;

	var
		i  		: byte;

	begin
		for i := 1 to 10 do
			if Score[Player] > Top10[i,Game].Score then

			begin
				CheckInsert := i;
				exit
			end;
		CheckInsert := 0
	end; { CheckInsert }

begin { CheckTopTen }
	ipoint := CheckInsert;
	if ipoint <> 0 then
	begin
		for i := 10 downto ipoint+1 do
		begin
			top10[i,Game].Score := Top10[i-1,Game].Score;
			top10[i,Game].Skill := Top10[i-1,Game].Skill;
			top10[i,Game].Level := Top10[i-1,Game].Level;
			top10[i,Game].Name := Top10[i-1,Game].Name
		end;
		Top10[ipoint,Game].Score := Score[Player];
		Top10[ipoint,Game].Skill := Skill[Player];
		Top10[ipoint,Game].Level := Level;
		Top10[ipoint,Game].Name := '';

		D := New(PDialog, Init(@Self, PChar(id_EnterHSDialog)));
		New(E1, InitResource(D, id_HSNameEdit, Sizeof(NameEdit)));

{ the following is because windows uses C type null terminated strings }
		D^.TransferBuffer:= @NameEdit[1];
		NameEdit[1]:= char(0);
		Application^.ExecDialog(D);

{ following converts null terminated string to a Pascal string }
		NameEdit[0]:=Char(LStrLen(@NameEdit[1]));
		Top10[ipoint,Game].Name:= NameEdit;
		temp := SetErrorMode(1);
{$I-}
		if ValidScore then
			repeat
				ReWrite(HiScore);
				ErrorVal := IOResult;
				HandleError(ErrorVal)
			until ErrorVal = 0;
		if ValidScore then
			repeat
				Write(HiScore,Top10);
				ErrorVal := IOResult;
				HandleError(ErrorVal)
			until ErrorVal = 0;
{$I+}
		temp := SetErrorMode(temp);
		if ValidScore then close(HiScore)
	end
end; { CheckTopTen }


{ Starts the game in the oddbu unit. Handles closing of window during a game or
	ending a game and entering name if high score }
procedure OddWindow.StartGame(var Msg: TMessage);

begin
	intro:= False;
	EnableMenuItem(Attr.Menu, cm_OddPlayRows, mf_ByCommand or mf_Grayed);
	EnableMenuItem(Attr.Menu, cm_OddPlayCol, mf_ByCommand or mf_Grayed);
	EnableMenuItem(Attr.Menu, cm_StartGame, mf_ByCommand or mf_Grayed);
	EnableMenuItem(Attr.Menu, cm_OddPause, mf_ByCommand or mf_Enabled);
	EnableMenuItem(Attr.Menu, cm_OddStop, mf_ByCommand or mf_Enabled);

	Oddwindows:= HWindow;

	songname:= 'playgame';
	oddbegin;
	songname:='stopgame';

	if not EndGame then
		begin
			closesound;
			halt; { Stops the game if it was closed by the system }
		end;		{ prevents a general protection fault from happening.}
{ The ExecDialog and EnableMenuItem cause the GPF because the program is theoretically
	non-existent if it gets to this point. If the game is closed while playing, EndGame
	is False, it becomes true on a proper exit ie. game over, or endgame selected.}

	Application^.ExecDialog((New(PDialog,Init(@Self, PChar(id_LostDialog)))));
	CheckTopTen;
	Enough:= True;

	EnableMenuItem(Attr.Menu, cm_OddPlayRows, mf_ByCommand or mf_Enabled);
	EnableMenuItem(Attr.Menu, cm_OddPlayCol, mf_ByCommand or mf_Enabled);
	EnableMenuItem(Attr.Menu, cm_StartGame, mf_ByCommand or mf_Enabled);
	EnableMenuItem(Attr.Menu, cm_OddPause, mf_ByCommand or mf_Grayed);
	EnableMenuItem(Attr.Menu, cm_OddStop, mf_ByCommand or mf_Grayed);

 end;


{ Oddballz Play Rows Game }
procedure OddWindow.PlayRows;
begin
{	mciExecute('stop all');
	mciExecute('play oddballz.wav from 3030 to 4890');
}
	Matcher:= False;
	CheckMenuItem(Attr.Menu, cm_OddPlayCol, mf_Bycommand or mf_Unchecked);
	CheckMenuItem(Attr.Menu, cm_OddPlayRows, mf_Bycommand or mf_checked);
end;

{ Oddballz Play Color Matching Game }
procedure Oddwindow.PlayCol;
begin
	Matcher:= True;
	CheckMenuItem(Attr.Menu, cm_OddPlayCol, mf_Bycommand or mf_checked);
	CheckMenuItem(Attr.Menu, cm_OddPlayRows, mf_Bycommand or mf_Unchecked);
end;

{ Oddballz End Game }
procedure Oddwindow.OddStop;
begin
	EndGame:=True;
	EnableMenuItem(Attr.Menu, cm_OddPlayRows, mf_ByCommand or mf_Enabled);
	EnableMenuItem(Attr.Menu, cm_OddPlayCol, mf_ByCommand or mf_Enabled);
	EnableMenuItem(Attr.Menu, cm_OddPause, mf_ByCommand or mf_Grayed);
	EnableMenuItem(Attr.Menu, cm_OddStop, mf_ByCommand or mf_Grayed);
end;

{ wmTimer Procedure }
procedure Oddwindow.wmTimer;
var
	temp, messg:string[50];

begin
	if NOT MIDI then
	begin
		temp:='stop ' + songname;
		temp:= temp + char(0);
		mciSendString(@temp[1],nil,0,0); { stop current song playing }
		exit;
	end;

	if songname <> lastsongname then { change song ? }
	begin
		temp:='stop ' + lastsongname;
		temp:= temp + char(0);
		mciSendString(@temp[1],nil,0,0); { stop current song playing }
		lastsongname:= songname;
	end;

	temp:='status ' + songname + ' mode';
	temp:= temp + char(0);
	mciSendString(@temp[1],@messg[1],50,0); { get status of current song playing }
	messg[0]:=char(LStrLen(@messg[1]));
	temp:='play ' + songname +' from 0';
	temp:= temp + char(0);
	if messg <> 'playing' then { is song stopped? }
		mciSendstring(@temp[1],NIL,0,0); { replay song from beginning }
end;

{ Paint Window }
procedure OddWindow.Paint(PaintDC: HDC; var PaintInfo: TPaintStruct);
var
	OldBitmap: HBitmap;
	MemDC: HDC;
	ball: integer;
	ABrush, OldBrush: HBrush;

begin
	If intro then
		begin
			OddWindows:= HWindow;
			MemDC := CreateCompatibleDC(PaintDC);
			OldBitmap:= SelectObject(MemDC, introscrnbmp);
			OldPalette:= SelectPalette(PaintDC, OddBallzPalette, False);
			SelectPalette(MemDC, OddBallzPalette, False);
			RealizePalette(PaintDC);
			RealizePalette(MemDC);
			BitBlt(PaintDC, 0, 0, SWidth, SHeight, MemDC, 0, 0, SRCCopy);
			SelectPalette(MemDC, OldPalette, False);
			SelectPalette(PaintDC, OldPalette, False);
			RealizePalette(PaintDC);
			RealizePalette(MemDC);
			SelectObject(MemDC, OldBitmap);
			DeleteDC(MemDC);
			exit;
		end;{if intro}

	If (not PauseFlag) then
		begin
			RedrawGame;
		end;

	If PauseFlag then
		begin
			OddWindows:= HWindow;
			MemDC := CreateCompatibleDC(PaintDC);
			OldBitmap:= SelectObject(MemDC, playscreenbmp);
			OldPalette:= SelectPalette(PaintDC, OddBallzPalette, False);
			SelectPalette(MemDC, OddBallzPalette, False);
			RealizePalette(PaintDC);
			RealizePalette(MemDC);
			BitBlt(PaintDC, 0, 0, SWidth, SHeight, MemDC, 0, 0, srcCopy);
			SelectObject(MemDC, pausebitmapmask); {mask paused}
			BitBlt(PaintDC, 76, 90, PWidth, PHeight, MemDC, 0, 0, srcAnd);
			SelectObject(MemDC, pausebitmap);
			BitBlt(PaintDC, 76, 90, PWidth, PHeight, MemDC, 0, 0, srcInvert);
			SelectPalette(MemDC, OldPalette, False);
			SelectPalette(PaintDC, OldPalette, False);
			RealizePalette(PaintDC);
			RealizePalette(MemDC);
			SelectObject(MemDC, OldBitmap);
			DeleteDC(MemDC);
			UpdateScore;
		end;{If PauseFlag}
end;

{ Can close }
function OddWindow.CanClose: boolean;
var
	D: PDialog;
begin
	CanClose:= True;

	D:= (New(PDialog,Init(@Self, PChar(id_CloseDialog))));
	If Application^.ExecDialog(D) = id_Cancel then
			begin
				CanClose:= False;
			end
		else
			begin
				WinHelp(HWindow,'odd.hlp',HELP_QUIT,0);
				mciSendString('stop all',nil,0,0);
				mciSendString('close striving.mid alias intro',nil,0,0);
				mciSendString('close breeze6.mid alias stopgame',nil,0,0);
				mciSendString('close metblast.mid alias playgame',nil,0,0);
			end;
	if not pauseflag then
	begin
		if not enough then
			EnableMenuItem(Attr.Menu, cm_OddStop, mf_ByCommand or mf_Enabled);

		CheckMenuItem(Attr.Menu, cm_OddPause, mf_Bycommand or mf_Unchecked);
	end;
end;


var

	Oddballz: OddApplication;

begin
	Oddballz.init('Oddballz');
  Oddballz.Run;
  Oddballz.Done;
end.