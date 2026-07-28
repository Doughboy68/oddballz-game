(* ** Oddballz by Fred Kohler ** *)
(* ** (c) 1991 ** *)
(* ** written using Borland Pascal 7.0 ** *)

(*	Oddballz ported to Windows 3.1 by Brian Semotiuk
		(c) 1991 / 1992 /1993
		written using Turbo Pascal for Windows V1.5
*)

unit OddUnit;

interface

uses
	WinTypes, Winprocs, MMSystem;

type
	PointType = record
		x,y: integer;
  end;

	PlayerInfo = record
		Score		: longint;
		Skill		: word;
		Level		: byte;
		Name		: string[24];
	end;

	TopTenInfo = array[1..10,1..3] of PlayerInfo;

{ The following variables are accessible to the main oddballz program. }
var
	DC, MemDC, DCO, MemDCO, TempDCO: HDC;
	Oddwindows: HWnd;
	OddBallzPalette,OldPalette : HPalette;
	OldBitmap, OldBitmap2, PlayScreenBmp, introscrnbmp, pausebitmap, pausebitmapmask: HBitmap;
	OddBallzShapes: array[0..8] of HBitmap;
	OddBallzShapesSave: array[0..3] of HBitmap;
	Enough, Drawn, LostFocusFlag, PauseQuit, ValidScore: boolean;
	Matcher, PauseFlag, endgame, PlaySound, Midi, Wave, MIDICAP: boolean;
	SWidth, SHeight, PWidth, PHeight, BWidth, BHeight: LongInt;
	HiScore			: File of TopTenInfo;
	Top10				: TopTenInfo;
	Player, Level,Game	: byte;
	Score				: array[1..6] of longint;
	Skill				: array[1..6] of word;
	HAccel : THandle; {  global Handle to point to the accelerator table - see dokey, pauser }
	DisplayColors: integer;
	songname, lastsongname : String[50];

{ The following procedures and functions are accessible from the main oddballz program. }
procedure oddbegin;
procedure pauser;
procedure EraseBallMap;
procedure EmptyScreen;
procedure RedrawGame;
function GameOver : boolean;
procedure UpdateScore;
function Int2Str(L: LongInt): string;
procedure HandleError(var ErrorN : integer);
procedure InitTop10;
procedure InitOBall;

implementation

type

	BallObj = record
		Image 	: array[0..3] of byte;			{ index to image array }
		Map,																{ position in Ball map }
		Rel			: array[0..3] of PointType	{ position relative to object };
  end;

	MapInfo = record
		InMap		: boolean;
		BzMap		: shortint;
		X,Y			: integer;
	end;

	LevelInfo = record
		LDelay,
		LShapes,
		LColors	 : byte;
	end;


	TransArray = array[-2..2,-2..2] of PointType;
	TransPtr = ^TransArray;

	ColorSet = record
		R, G, B		: integer;
	end;

const
  LevAttr : array[1..50] of LevelInfo =
( ( LDelay:100 ; Lshapes:2 ; LColors:3 ),
	( LDelay:100 ; Lshapes:2 ; LColors:4 ),
	( LDelay:100 ; Lshapes:3 ; LColors:4 ),
	( LDelay:100 ; Lshapes:3 ; LColors:5 ),
	( LDelay:100 ; Lshapes:4 ; LColors:5 ),
	( LDelay:100 ; Lshapes:4 ; LColors:6 ),
	( LDelay:100 ; Lshapes:5 ; LColors:6 ),
	( LDelay:100 ; Lshapes:5 ; LColors:6 ),
	( LDelay:100 ; Lshapes:6 ; LColors:6 ),
	( LDelay:100 ; Lshapes:7 ; LColors:6 ),
	( LDelay:100 ; Lshapes:7 ; LColors:6 ),
	( LDelay:98 ; Lshapes:7 ; LColors:6 ),
	( LDelay:95 ; Lshapes:7 ; LColors:6 ),
	( LDelay:93 ; Lshapes:7 ; LColors:6 ),
	( LDelay:90 ; Lshapes:7 ; LColors:6 ),
	( LDelay:88 ; Lshapes:7 ; LColors:6 ),
	( LDelay:85 ; Lshapes:7 ; LColors:6 ),
	( LDelay:83 ; Lshapes:7 ; LColors:6 ),
	( LDelay:80 ; Lshapes:7 ; LColors:6 ),
	( LDelay:78 ; Lshapes:7 ; LColors:6 ),
	( LDelay:76 ; Lshapes:7 ; LColors:6 ),
	( LDelay:74 ; Lshapes:7 ; LColors:6 ),
	( LDelay:72 ; Lshapes:7 ; LColors:6 ),
	( LDelay:70 ; Lshapes:7 ; LColors:6 ),
	( LDelay:68 ; Lshapes:7 ; LColors:6 ),
	( LDelay:66 ; Lshapes:7 ; LColors:6 ),
	( LDelay:64 ; Lshapes:7 ; LColors:6 ),
	( LDelay:62 ; Lshapes:7 ; LColors:6 ),
	( LDelay:60 ; Lshapes:7 ; LColors:6 ),
	( LDelay:59 ; Lshapes:7 ; LColors:6 ),
	( LDelay:58 ; Lshapes:7 ; LColors:6 ),
	( LDelay:57 ; Lshapes:7 ; LColors:6 ),
	( LDelay:56 ; Lshapes:7 ; LColors:6 ),
	( LDelay:55 ; Lshapes:7 ; LColors:6 ),
	( LDelay:54 ; Lshapes:7 ; LColors:6 ),
	( LDelay:53 ; Lshapes:7 ; LColors:6 ),
	( LDelay:52 ; Lshapes:7 ; LColors:6 ),
	( LDelay:51 ; Lshapes:7 ; LColors:6 ),
	( LDelay:50 ; Lshapes:7 ; LColors:6 ),
	( LDelay:49 ; Lshapes:7 ; LColors:6 ),
	( LDelay:48 ; Lshapes:7 ; LColors:6 ),
	( LDelay:47 ; Lshapes:7 ; LColors:6 ),
	( LDelay:46 ; Lshapes:7 ; LColors:6 ),
	( LDelay:45 ; Lshapes:7 ; LColors:6 ),
	( LDelay:42 ; Lshapes:7 ; LColors:6 ),
	( LDelay:40 ; Lshapes:7 ; LColors:6 ),
	( LDelay:35 ; Lshapes:7 ; LColors:6 ),
	( LDelay:30 ; Lshapes:7 ; LColors:6 ),
	( LDelay:25 ; Lshapes:7 ; LColors:6 ),
	( LDelay:20 ; Lshapes:7 ; LColors:6 ) );


	OBClr : array[0..7] of ColorSet =
( (R:63 ; G:63 ; B:63),
	(R:63 ; G: 0 ; B: 0),
	(R: 0 ; G:63 ; B: 0),
	(R: 0 ; G: 0 ; B:63),
	(R:63 ; G:63 ; B: 0),
	(R: 0 ; G:63 ; B:63),
	(R:63 ; G: 0 ; B:63),
	(R:63 ; G:47 ; B:31) );


const

	Freq : array[2..20] of longint =
	( 25,27,28,30,32,33,35,37,39,40,42,44,45,47,49,51,52,54,56);

	MidRow : array[0..15] of PointType =
( (x:12 ; y:19), (x:11 ; y:18), (x:10 ; y:17), (x: 9 ; y:16),
	(x: 8 ; y:15), (x: 7 ; y:14), (x: 6 ; y:13), (x: 5 ; y:12),
	(x: 4 ; y:11), (x: 4 ; y:10),	(x: 4 ; y: 9), (x: 4 ; y: 8),
	(x: 4 ; y: 7), (x: 4 ; y: 6), (x: 4 ; y: 5), (x: 4 ; y: 4) );

	RtRow : array[0..8] of PointType =
( (x:20 ; y:19), (x:19 ; y:19), (x:18 ; y:19), (x:17 ; y:19),
	(x:16 ; y:19), (x:15 ; y:19), (x:14 ; y:19), (x:13 ; y:19),
	(x:12 ; y:19) );

	LtRow : array[0..8] of PointType =
( (x:12 ; y:19), (x:13 ; y:19), (x:14 ; y:19), (x:15 ; y:19),
	(x:16 ; y:19), (x:17 ; y:19), (x:18 ; y:19), (x:19 ; y:19),
	(x:20 ; y:19) );

	BallShapes : array[0..6,1..3] of PointType =
( ( (x:-1 ; y: 0), (x:-1 ; y:-1), (x: 0 ; y:-1) ),
	(	(x:-1 ; y: 0), (x:-2 ; y: 0), (x: 1 ; y: 0) ),
	( (x:-1 ; y: 0), (x: 1 ; y: 0), (x: 0 ; y:-1) ),
	( (x:-1 ; y: 0), (x:-2 ; y:-1), (x: 1 ; y: 0) ),
	( (x:-1 ; y:-1), (x:-2 ; y:-1), (x: 1 ; y: 0) ),
	( (x:-1 ; y: 0), (x:-2 ; y:-1), (x:-2 ; y:-2) ),
	( (x:-1 ; y: 0), (x: 0 ; y:-1), (x: 1 ; y: 1) ) );

	RotCCW : TransArray =
( ( (x:-2 ; y: 0), (x:-2 ; y:-1), (x:-2 ; y:-2), (x: 0 ; y: 0), (x: 0 ; y: 0) ),
	( (x:-1 ; y: 1), (x:-1 ; y: 0), (x:-1 ; y:-1), (x:-1 ; y:-2), (x: 0 ; y: 0) ),
	( (x: 0 ; y: 2), (x: 0 ; y: 1), (x: 0 ; y: 0), (x: 0 ; y:-1), (x: 0 ; y:-2) ),
	( (x: 0 ; y: 0), (x: 1 ; y: 2), (x: 1 ; y: 1), (x: 1 ; y: 0), (x: 1 ; y:-1) ),
	( (x: 0 ; y: 0), (x: 0 ; y: 0), (x: 2 ; y: 2), (x: 2 ; y: 1), (x: 2 ; y: 0) ) );

	RotCW		: TransArray =
( ( (x: 0 ; y:-2), (x: 1 ; y:-1), (x: 2 ; y: 0), (x: 0 ; y: 0), (x: 0 ; y: 0) ),
	( (x:-1 ; y:-2), (x: 0 ; y:-1), (x: 1 ; y: 0), (x: 2 ; y: 1), (x: 0 ; y: 0) ),
	( (x:-2 ; y:-2), (x:-1 ; y:-1), (x: 0 ; y: 0), (x: 1 ; y: 1), (x: 2 ; y: 2) ),
	( (x: 0 ; y: 0), (x:-2 ; y:-1), (x:-1 ; y: 0), (x: 0 ; y: 1), (x: 1 ; y: 2) ),
	( (x: 0 ; y: 0), (x: 0 ; y: 0), (x:-2 ; y: 0), (x:-1 ; y: 1), (x: 0 ; y: 2) ) );

	FlipY		: TransArray =
( ( (x: 0 ; y: 2), (x: 1 ; y: 2), (x: 2 ; y: 2), (x: 0 ; y: 0), (x: 0 ; y: 0) ),
	( (x:-1 ; y: 1), (x: 0 ; y: 1), (x: 1 ; y: 1), (x: 2 ; y: 1), (x: 0 ; y: 0) ),
	( (x:-2 ; y: 0), (x:-1 ; y: 0), (x: 0 ; y: 0), (x: 1 ; y: 0), (x: 2 ; y: 0) ),
	( (x: 0 ; y: 0), (x:-2 ; y:-1), (x:-1 ; y:-1), (x: 0 ; y:-1), (x: 1 ; y:-1) ),
	( (x: 0 ; y: 0), (x: 0 ; y: 0), (x:-2 ; y:-2), (x:-1 ; y:-2), (x: 0 ; y:-2) ) );

	FlipX		: TransArray =
( ( (x: 0 ; y:-2), (x:-1 ; y:-2), (x:-2 ; y:-2), (x: 0 ; y: 0), (x: 0 ; y: 0) ),
	( (x: 1 ; y:-1), (x: 0 ; y:-1), (x:-1 ; y:-1), (x:-2 ; y:-1), (x: 0 ; y: 0) ),
	( (x: 2 ; y: 0), (x: 1 ; y: 0), (x: 0 ; y: 0), (x:-1 ; y: 0), (x:-2 ; y: 0) ),
	( (x: 0 ; y: 0), (x: 2 ; y: 1), (x: 1 ; y: 1), (x: 0 ; y: 1), (x:-1 ; y: 1) ),
	( (x: 0 ; y: 0), (x: 0 ; y: 0), (x: 2 ; y: 2), (x: 1 ; y: 2), (x: 0 ; y: 2) ) );


	StartPos : array[0..3] of PointType =
( (x:6 ; y:2), (x:7 ; y:2), (x:8 ; y:2), (x:9 ; y:2) );

	PlayerOrd : Array[1..6] of String = ('1st','2nd','3rd','4th','5th','6th');

const
	Wait 			: integer = 10;

{ These variables are only used in this unit }
var
	TwoPlayer,
	ZipBonus		: boolean;
	PauseTime		: word;
	Direction,
	Colors,
	Shapes,
	Rows,
	RowCount,
	LevCol,
	MatchesDone,
	NewLevel		: byte;
	ColorInc		: array[0..4] of word;
	ColorCount	: array[0..3] of longint;
	PlayerName	: string;
	BallMap			: array[2..22,0..21] of MapInfo;
	BallPic			: array[0..6] of pointer;
	Oddballz		: Ballobj;
	BallSize		: word;
	Low,High,
	Max,
	Result			: integer;
	MatchList		: array[0..199] of PointType;
	SameBonus,
	MatchCount  : array[1..6] of byte;
	BallCount		: array[1..6] of longint;


{ This is the new prototype delay routine that uses the hi-resolution timer in the
	MMSYSTEM Unit. It Requires Windows 3.1 which shouldn't be a problem now due to its
	popularity. Works 100%!!! Turning off turbo on my 486DX-33 doesn't have any effect on
	the speed of the oddballz falling (even at highest level). The only difference in speed
	is in the supported and zip routines (inefficient code???), but this shouldn't affect the
	game play. Brian S. - 02/16/93
}
procedure Delay(Timedelay: LongInt);
var
	finish: LongInt;
begin
	finish:= timeGetTime + Timedelay; {Get the current milliseconds & add desired delay}
	repeat until (timeGetTime > finish); {Has the specified # of millisecs. passed yet?}
end;


function fstr(I:integer):string;
var s:string;
begin
  str(i,s);
  fstr := s;
end;


function Two2N(N : word) : word;
var
	X : word;
	i : byte;
begin
  if N>0 then
	begin
		X := 2;
		for i := 2 to N do X := X*2;
	end;
	Two2N := X;
	if N=0 then Two2N := 1
end;

function Int2Str(L : LongInt) : String;
{ Converts an integer to a string for use with OutText, OutTextXY }
var
  S : String;
begin
  Str(L, S);
  Int2Str := S;
end; { Int2Str }


function CheckInMap(MPts : PointType) : boolean;
begin
	CheckInMap := BallMap[MPts.X,MPts.Y].InMap;
end;

function CheckDraw(MPts : PointType) : boolean;
begin
	CheckDraw := (BallMap[MPts.X,MPts.Y].InMap and (MPts.Y > 2));
end;

procedure InitMapCoord(var MapPts : PointType);
var
	XSize,
	YSize		: word;
begin
	XSize := 8;
	YSize := 13;
	if MapPts.Y < 12 then
		MapPts.X := ((9-MapPts.Y)*XSize)+((MapPts.X-3)*XSize*2)+XSize
	else
		MapPts.X := ((MapPts.Y-11)*XSize)+((MapPts.X-(MapPts.Y-7))*XSize*2)+XSize;
	MapPts.Y := (MapPts.Y-3)*YSize
end;


procedure EraseBallMap;
var
	X,Y : byte;
begin
	for X := 4 to 20 do
		for Y := 0 to 19 do
			BallMap[X,Y].BzMap := 0;
end;

procedure InitBallMap;
var
	X,Y : byte;
	mpts : PointType;
begin
	for X := 2 to 22 do
		for Y := 0 to 21 do
		begin
			BallMap[X,Y].InMap := false;
			BallMap[X,Y].BzMap := 0;
		end;
	for X := 4 to 20 do
		for Y := 0 to 19 do
      if ( (Y<12) and (X<(Y+10) )) or ( (Y>11) and (X>(Y-8) )) then
			begin
				BallMap[X,Y].InMap := true;
				Mpts.X := X ; Mpts.Y := Y;
				InitMapCoord(Mpts);
				BallMap[X,Y].X := Mpts.X;
				BallMap[X,Y].Y := Mpts.Y
			end
end; { InitBallMap }

procedure MapCoord(var MapPts : PointType);
var X,Y	: word;
begin
	X := MapPts.X ; Y := MapPts.Y;
	MapPts.X := BallMap[X,Y].X;
	MapPts.Y := BallMap[X,Y].Y
end;

procedure Move( var Pts : PointType; Direction : byte);
begin
	case Direction of
		0	: begin Pts.X := Pts.X-1 ; Pts.Y := Pts.Y-1 end;
		1	: Pts.X := Pts.X-1;
		2	: Pts.Y := Pts.Y+1;
		3	: Pts.Y := Pts.Y-1;
		4	: Pts.X := Pts.X+1;
		5	: begin Pts.X := Pts.X+1 ; Pts.Y := Pts.Y+1 end;
		6 : begin Pts.X := Pts.X-2 ; Pts.Y := Pts.Y-1 end;
		7	: begin Pts.X := Pts.X-1 ; Pts.Y := Pts.Y+1 end;
		8	: begin Pts.X := Pts.X+1 ; Pts.Y := Pts.Y+2 end;
		9 : begin Pts.X := Pts.X-1 ; Pts.Y := Pts.Y-2 end;
		10 : begin Pts.X := Pts.X+1 ; Pts.Y := Pts.Y-1 end;
		11 : begin Pts.X := Pts.X+2 ; Pts.Y := Pts.Y+1 end;
	end;
end;

Procedure InitColorInc;
var
	j,
	i			: byte;
	temp	: integer;
begin
	ColorInc[0] := 1;
	for i := 0 to 3 do
	begin
		temp := 1;
    for j := 0 to i do
			temp := temp * colors;
		temp := temp + 1;
		ColorInc[i+1] := temp;
		ColorCount[i] := 0
	end;
end;

procedure UpdateScore; { Rewritten for Windows - Brian S. }
	var
		i,
		colr		: byte;
		center	: integer;
    temps		: string;
		oldbrush, brush: HBrush;

begin
	DC:= GetDC(OddWindows);
	SetBkMode(DC, Transparent);
  Brush:= CreateSolidBrush(RGB(0,0,0)); { Black }
	OldBrush:= SelectObject(DC, Brush);
	Rectangle(DC,7,22,32,37);       { Erase Rectangles before writing text }
	Rectangle(DC,258,22,314,37);
	Rectangle(DC,8,198,44,213);
	Rectangle(DC,234,215,313,230);
	SelectObject(DC, OldBrush);
	DeleteObject(Brush);

	SetTextColor(DC, RGB(75,235,199)); { Cyan }

	temps:= Int2Str(BallCount[Player]);
	TextOut(DC, 10, 198, @temps[1], Length(temps));
  temps:= Int2Str(Skill[Player]);
	TextOut(DC, 260, 22, @temps[1], Length(temps));
  temps:= Int2Str(Score[Player]);
	TextOut(DC, 236,215, @temps[1], Length(temps));

	if (LevCol > 0) then { Change level color for # turns, see CheckAdvance }
		SetTextColor(DC, RGB(255,0,255)); { Purple }

	temps:= Int2Str(Level);
	TextOut(DC, 9, 22, @temps[1], Length(temps));

	ReleaseDC(OddWindows, DC);

	if (NewLevel > 0) then
	begin
		colr := 12;
		Inc(NewLevel)
	end
	else
		colr :=10;
	if NewLevel > 4 then NewLevel := 0;
end;

procedure HandleError(var ErrorN : integer);
var
	Reply			: integer;
	EMsg			: String;
	IsFunc		: boolean;
begin
	if ErrorN <> 0 then
	begin
		case ErrorN of
			2		: EMsg := 'it could not be found.';
			3		: EMsg := 'it could not be found.';
			5		: EMsg := 'access to it was denied.';
			100 : EMsg := 'of a disk read error.';
			101 : EMsg := 'of a disk write error.';
			103	: EMsg := 'it was not open.';
			150 : EMsg := 'the disk is write protected.';
			152 : EMsg := 'the disk is not ready.';
		else
			EMsg := 'of a DOS I/O Error # '+Int2Str(ErrorN)+'.';
		end;
		Emsg :='The high score file, named "HISCORE.DAT,"'+#13+'could not be used because'+#13+Emsg;
		EMsg[Length(EMsg)+1]:= char(0);
		Reply:=MessageBox(0,  @EMsg[1], 'File Access Error',
			MB_RETRYCANCEL+MB_ICONEXCLAMATION);
		if Reply = IDCANCEL then
		begin
			ErrorN := 0;
			ValidScore := false
		end
	end
end;

procedure InitTop10;
var
	i,j				 : byte;
	ErrorVal	: integer;
begin
	{$I-}
	repeat
		Reset(HiScore);
		ErrorVal := IOResult;
		HandleError(ErrorVal)
	until ErrorVal = 0;
	if ValidScore then
	repeat
		Read(HiScore,Top10);
		ErrorVal := IOResult;
		HandleError(ErrorVal)
	until ErrorVal = 0;
	{$I+}
if not ValidScore then
	for i := 1 to 10 do
		for j:= 1 to 3 do
		begin
			Top10[i,j].Score := 0;
			Top10[i,j].Skill := 1;
			Top10[i,j].Level := 1;
			Top10[i,j].Name := ''
		end;
end;

procedure InitGame;
var
	i		: byte;
begin
	TwoPlayer:= False; { I have no plans to support two player mode in the Windows version }
  Player:= 1; { I have no plans to support tournament mode in the Windows version }
	Drawn:= False;
  EraseBallMap;
	Level := 1;
	NewLevel := 0;
	Player := 1;
	with LevAttr[Level] do
	begin
		Shapes := LShapes;
		Pausetime := LDelay;
		Colors := LColors;
	end;
	if TwoPlayer then Colors := 3;
	Rows := 0;
	RowCount := 0;
	for i := 1 to 6 do
	begin
		Skill[i] := 1;
		MatchCount[i] := 0;
		SameBonus[i] := 0;
		Score[i] := 0;
		BallCount[i] := 0;
	end;
	MatchesDone := 0;
	ZipBonus := false;
	Enough := false;
	InitColorInc;
	if Matcher then
		Game := 1
	else
		Game := 3;
	Assign(HiScore,'HISCORE.DAT');
	InitTop10;
end;

procedure InitOBall;
begin
	Oddballz.Rel[0].X := 0;
	Oddballz.Rel[0].Y := 0;
	InitBallMap;
	ValidScore := true;
	InitGame;
end;

procedure Transform(TPtr : TransPtr );
var
	Pts 			: PointType;
	i					: byte;
	SaveMove 	: array[1..3] of PointType;
	Transable	: boolean;
begin
	Transable := true;
	with Oddballz do
	begin
		for i := 1 to 3 do
		begin
			SaveMove[i].X := TPtr^[Rel[i].Y,Rel[i].X].X;
			SaveMove[i].Y := TPtr^[Rel[i].Y,Rel[i].X].Y;
			Pts.X := Map[0].X+SaveMove[i].X;
			Pts.Y := Map[0].Y+SaveMove[i].Y;
			if not(CheckInMap(Pts) and (BallMap[Pts.X,Pts.Y].BzMap=0))
			then Transable := false
		end; {for}
		if Transable then
		begin
			for i := 1 to 3 do
			begin
				Rel[i].X := SaveMove[i].X;
				Rel[i].Y := SaveMove[i].Y;
				Map[i].X := Map[0].X+Rel[i].X;
				Map[i].Y := Map[0].Y+Rel[i].Y
			end {for}
		end {if}
	end {with}
end;

procedure Build;
var
	i 			: byte;
	Config 	: byte;
	pos			: byte;

procedure GetCColors;
var
	cset,
	i				: byte;
begin
	cset := ((Player-1)*3)+1;
	for i := 0 to 3 do
	begin
		if i = 0 then
	    OddBallz.Image[i] := (ColorCount[i] mod Colors)+cset
		else
    	OddBallz.Image[i] := ((ColorCount[i] div (ColorInc[i]-1) )mod Colors)+cset;
			if not(TwoPlayer) then
				Inc(ColorCount[i],ColorInc[i])
			else
				if Player = 2 then Inc(ColorCount[i],ColorInc[i]);
 	end;
end;

procedure GetRColors;
var
	i		: byte;
begin
	for i := 0 to  3 do
		begin
			if Config<6 then
 		    OddBallz.Image[i] := Config+1
			else
		    OddBallz.Image[i] := Random(6)+1;
		end
end;

begin
	if boolean(random(2)) then Direction := 5 else Direction := 2;
	Config := Random(Shapes);
	pos := Random(4);
	if Matcher then GetCColors else GetRColors;
	with Oddballz do
	begin
		Map[0].X := StartPos[pos].X;
		Map[0].Y := StartPos[pos].Y;
		for i := 1 to 3 do
		begin
			Rel[i].X := BallShapes[Config,i].X;
			Rel[i].Y := BallShapes[Config,i].Y;
			Map[i].X := Map[0].X + BallShapes[Config,i].X;
			Map[i].Y := Map[0].Y + BallShapes[Config,i].Y;
		end; {for}
	end; {with}
	for i := 0 to random(6) do Transform(@RotCW);
	if boolean(random(2)) then Transform(@FlipX);
	if boolean(random(2)) then Transform(@FlipY);
	Inc(BallCount[Player]);
end;

procedure Draw1Ball(DrawPts : PointType; DrawColor : byte; i: Integer);

{ This is my re-written routine to draw a ball in Windows.
	I use a Global Device Context - DCO and compatibleDC - MemDCO, TempDCO.
	This speeds up drawing and erasing in Windows, rather than creating
	and destroying the DCO and MemDCO each time. - Brian S.

	Revision June 10,1993 - Balls are now masked to background screen. This
	enables other backgrounds than just black. Slower on older CPU's but seems
	just as fast on my 486. Brian S.
}

begin
	if CheckDraw(DrawPts) then
	begin

		MapCoord(DrawPts);
		OldBitmap:= SelectObject(MemDCO, OddBallzShapes[8]); {Mask bitmap}
		BitBlt(DCO,DrawPts.X,DrawPts.Y,BWidth,BHeight,MemDCO,0,0,srcAnd); {mask playscreen}
		SelectObject(MemDCO, OddBallzShapes[DrawColor]); {actual ball bitmap}
		BitBlt(DCO,DrawPts.X,DrawPts.Y,BWidth,BHeight,MemDCO,0,0,srcInvert); {draw oddball}
		SelectObject(MemDCO, OldBitmap);
	end;
end;


procedure Erase1Ball(DrawPts : PointType; DrawColor: byte; i: Integer);
{ This is a whole new procedure because the original just toggled the ball on and
	off. Because of the masking, I had to write a new routine to erase the ball
	and restore the original background playscreen. Because there could be so many
	balls to keep track of, saving the background for each seemed unrealistic. Therefore
	I create a masked ball shaped bitmap from anywhere on the playfield and bltblt it
	to the screen as I would a ball. In most other types of games this method would not
	be used because most games have far less moveable objects. Brian S.
}
begin
	if CheckDraw(DrawPts) then
	begin
		MapCoord(DrawPts);
		OldBitmap:= SelectObject(MemDCO, OddBallzShapes[8]); {Mask: black fg, white bg}
		SelectObject(TempDCO, OddBallzShapes[7]); {Temp to store ball shaped bitmap}
		BitBlt(TempDCO,0,0,BWidth,BHeight,MemDCO,0,0,notsrccopy); {Invert Mask to Temp}
																															{ie: white fg, black bg}
		SelectObject(MemDCO, PlayScreenBmp); {Select playscreen as source}
		BitBlt(TempDCO,0,0,BWidth,BHeight,MemDCO,DrawPts.X,DrawPts.Y,srcAnd);{and old with inverted mask}
		SelectObject(MemDCO, OddBallzShapes[8]); {Mask}
		BitBlt(DCO,DrawPts.X,DrawPts.Y,BWidth,BHeight,MemDCO,0,0,srcAnd); {mask playscreen}
		SelectObject(TempDCO, OddBallzShapes[7]); {This now contains ball shaped chunk of screen}
																							{with a black background}
		BitBlt(DCO,DrawPts.X,DrawPts.Y,BWidth,BHeight,TempDCO,0,0,srcInvert); {restore screen}
		SelectObject(MemDCO, OldBitmap);
	end;
end;

procedure TogglePlayField;
var
	Pts				: PointType;
	X, Y			: integer;
begin
	DCO:= GetDC(OddWindows);
	MemDCO:= CreateCompatibleDC(DCO);
	TempDCO:= CreateCompatibleDC(DCO);
	for X := 4 to 20 do
		for Y := 3 to 19 do
		begin
			Pts.X := X;
			Pts.Y := Y;
			if BallMap[X,Y].BzMap<>0 then
				Draw1Ball(Pts,BallMap[X,Y].BzMap,0)
		end;
	DeleteDC(MemDCO);
	DeleteDC(TempDCO);
	ReleaseDC(OddWindows, DCO);
end;

procedure Draw;
var
	i: byte;
begin
	DCO:= GetDC(OddWindows);
	MemDCO:= CreateCompatibleDC(DCO);
	TempDCO:= CreateCompatibleDC(DCO);

	Drawn:= True; { Added this boolean for redrawscreen procedure - Brian S. }
	with Oddballz do
	begin
		for i := 0 to 3 do
				Draw1Ball(Map[i],Image[i],i);
	end; {with}

	DeleteDC(MemDCO);
	DeleteDC(TempDCO);
	ReleaseDC(OddWindows, DCO);
end;

procedure Erase; { Looks similar to Draw! }
var
	i: byte;
begin
	DCO:= GetDC(OddWindows);
	MemDCO:= CreateCompatibleDC(DCO);
	TempDCO:= CreateCompatibleDC(DCO);

	Drawn:= False; { Except this, which I added, see Draw - Brian S. }
	with Oddballz do
	begin
		for i := 3 downto 0 do
			Erase1Ball(Map[i],Image[i],i)
	end; {with}

	DeleteDC(MemDCO);
	DeleteDC(TempDCO);
	ReleaseDC(OddWindows, DCO);
end;


function MoveOBall(dir : byte) : boolean ;
var
	Pts 			: PointType;
	i					: byte;
	SaveMove 	: array[0..3] of PointType;
	Moveable	: boolean;
begin
	Moveable := true;
	with Oddballz do
	begin
		for i := 0 to 3 do
		begin
			Pts.X := Map[i].X;
			Pts.Y := Map[i].Y;
			Move(Pts,dir);
			if CheckInMap(Pts) and (BallMap[Pts.X,Pts.Y].BzMap=0) then
			begin
				SaveMove[i].X := Pts.X;
				SaveMove[i].Y := Pts.Y;
			end
			else
				Moveable := false
		end; {for}
		if Moveable then
		begin
			for i := 0 to 3 do
			begin
				Map[i].X := SaveMove[i].X;
				Map[i].Y := SaveMove[i].Y;
			end {for}
		end {if}
	end; {with}
	MoveOBall := Moveable
end;

function GameOver : boolean;
var
	Pts				: PointType;
	X, Y			: integer;
begin
	GameOver := false;
	for X := 4 to 12 do
		for Y := 0 to 3 do
		begin
			Pts.X := X;
			Pts.Y := Y;
			if CheckInMap(Pts) and (BallMap[X,Y].BzMap<>0) then
				GameOver := true;
		end {for}
end;

procedure Stamp;
var
	i				: byte;
begin
	for i := 0 to 3 do
	begin
		with Oddballz do
		begin
			BallMap[Map[i].X,Map[i].Y].BzMap := Image[i];
		end;
	end;
	Draw
end;

procedure CheckRows;
var
	coldir,
	X,Y						: byte;
	RowPts				: PointType;
	SavePts,
	StartPts			: PointType;
	NoRows,
	NoneDropped		: boolean;
	Messg					: TMsg;

{ Wow! looks like a doubly nested function for the CheckRows Procedure!
	I guess Fred was too lazy to "nest" them properly - only took me an hour or so to figure
	it out! Brian S.
}
procedure CheckGaps;
var
	FlipGate  : boolean;
	DropDir,
	SaveColor,
	X,Y				: byte;

function Supported(Spts : PointType ) : boolean;{We sure are nested now, easy to see - NOT!!!}
var
	i : byte;
begin
	SavePts.X := Spts.X;
	SavePts.Y := Spts.Y;
	move(Spts,2);
	move(SavePts,5);
	if CheckInMap(Spts) and CheckInMap(SavePts) then
	begin
		if (BallMap[Spts.X,Spts.Y].BzMap=0)
		and (BallMap[SavePts.X,SavePts.Y].BzMap=0) then
		begin
			Supported := false;
			exit
		end
	end;
	Supported := true
end;{Supported}

begin {CheckGaps}
	NoneDropped := true;
	FlipGate := true;
	for Y := 19 downto 0 do
		for X := 4 to 20 do
		begin
			StartPts.X := X;
			StartPts.Y := Y;
			SaveColor :=	BallMap[StartPts.X,StartPts.Y].BzMap;
			if CheckInMap(StartPts) and (SaveColor <> 0) then
			begin
				if not(Supported(StartPts)) then
				begin
					NoneDropped := False;

					if PlaySound then
						begin
							SetVoiceNote(1,((Freq[StartPts.X] + Freq[StartPts.Y]) div 2),250,0);
							StartSound;
							WaitSoundState(S_QueueEmpty);
						end else delay(14);

						repeat
						Erase1Ball(StartPts,SaveColor,0);

						BallMap[StartPts.X,StartPts.Y].BzMap := 0;
						if FlipGate then DropDir := 2 else DropDir := 5;
						FlipGate := not FlipGate;
						SavePts.X := StartPts.X;
						SavePts.Y := StartPts.Y;
						move(SavePts,DropDir);
						if CheckInMap(SavePts)
						and (BallMap[SavePts.X,SavePts.Y].BzMap=0) then
							move(StartPts,DropDir);
						Draw1Ball(StartPts,SaveColor,0);
						BallMap[StartPts.X,StartPts.Y].BzMap := SaveColor;
						Delay(10);
					until Supported(StartPts);
				end
			end
		end
end;{CheckGaps}
{Whew!!! We're out of that mess now, but maybe there's more}


function RowFull( RPts : PointType; dir : byte) : boolean;
var
	i 				: byte;
begin
	repeat
		if BallMap[RPts.X,RPts.Y].BzMap=0 then
		begin
			RowFull := false;
			exit
		end;
		Move(RPts,dir)
	until not(CheckInMap(RPts));
	RowFull := true;
	NoRows := false
end;{RowFull}

procedure DeleteRow(RPts : PointType; rdir,cdir : byte);
var
	X,
	Y,
	i,
	image   : byte;
	DrawPts,
	ColPts  : PointType;
begin
	Inc(RowCount);
	repeat
		ColPts.X := RPts.X;
		ColPts.Y := RPts.Y;
		repeat
			DrawPts.X := ColPts.X ; DrawPts.Y := ColPts.Y;
			if (ColPts.X = Rpts.X) and (ColPts.Y = Rpts.Y) then
			begin
				for i := 1 to 2 do
				begin
					Draw1Ball(DrawPts,0,0);

					if PlaySound then
						begin
							SetVoiceNote(1,((Freq[ColPts.X] + Freq[ColPts.Y]) div 2),250,0);
							StartSound;
							WaitSoundState(S_QueueEmpty);
						end else delay(14);

					Erase1Ball(DrawPts,0,0);
				end
			end;
			image := BallMap[ColPts.X,ColPts.Y].BzMap;
			Erase1Ball(DrawPts,image,0);
			X := ColPts.X ; Y := ColPts.Y;
			move(ColPts,cdir);
			BallMap[X,Y].BzMap := BallMap[ColPts.X,ColPts.Y].BzMap;
			image := BallMap[X,Y].BzMap;
			if image<>0 then Draw1Ball(DrawPts,image,0);
		until not(CheckInMap(ColPts)) or (BallMap[ColPts.X,ColPts.Y].BzMap=0);
		move(RPts,rdir)
	until not(CheckInMap(RPts))
end;{DeleteRow}

procedure FindRows;
var
	r					: byte;
begin
	NoRows := true;
	if boolean(random(2)) then coldir := 3 else coldir := 0;
	for r := 0 to 15 do
	begin
		RowPts.X := MidRow[r].X;
		RowPts.Y := MidRow[r].Y;
		while RowFull(RowPts,4) do DeleteRow(RowPts,4,coldir)
	end; {for}
	for r := 0 to 8 do
	begin
		RowPts.X := LtRow[r].X;
		RowPts.Y := LtRow[r].Y;
		while RowFull(RowPts,0) do DeleteRow(RowPts,0,3)
	end; {for}
	for r := 0 to 8 do
	begin
		RowPts.X := RtRow[r].X;
		RowPts.Y := RtRow[r].Y;
		while RowFull(RowPts,3) do DeleteRow(RowPts,3,0)
	end; {for}
end;{FindRows}

begin{CheckRows}
{ What I'm doing is getting a display context and then I'll release it after the called
	functions are done their stuff!}

	repeat
		DCO:= GetDC(OddWindows);
		MemDCO:= CreateCompatibleDC(DCO);
		TempDCO:= CreateCompatibleDC(DCO);
		FindRows;
		CheckGaps;
		DeleteDC(MemDCO);
		DeleteDC(TempDCO);
		ReleaseDC(OddWindows, DCO);

		if PeekMessage(Messg,0,0,0, pm_remove) then {Only read wm_KeyDown msgs}
				begin
					TranslateMessage(Messg);
					DispatchMessage(Messg);
				end;
	until NoRows and NoneDropped;
end;{CheckRows}


{*******************************************************************************}
procedure CheckMatches;{Look for the actual start of this procedure way way down}
var
	Length,
	Index,
	SaveColor,
	X,Y						: byte;
	SavePts,
	StartPts			: PointType;
	NoneDropped		: boolean;
	Messg					: TMsg;

{ Well what do you know, ain't out of the woods yet! Here's more lovely nestings!
	Sure wish they were indented, maybe I'll eventually take the time to do this but
	I like making fun of Fred's coding!}

procedure CheckGaps;
var
	FlipGate  : boolean;
	DrawPts   : PointType;
	DropDir		: byte;
	X,Y				: byte;

function Supported(Spts : PointType ) : boolean;
begin
	SavePts.X := Spts.X;
	SavePts.Y := Spts.Y;
	move(Spts,2);
	move(SavePts,5);
	if ((BallMap[Spts.X,Spts.Y].BzMap=0)and CheckInMap(SPts))
	or ((BallMap[SavePts.X,SavePts.Y].BzMap=0)and CheckInMap(SavePts)) then
	begin
		Supported := false;
		exit
	end;
	Supported := true
end;{Supported}

begin{CheckGaps}
	NoneDropped := true;
	FlipGate := true;
	for Y := 19 downto 0 do
		for X := 4 to 20 do
		begin
			StartPts.X := X;
			StartPts.Y := Y;
			SaveColor :=	BallMap[StartPts.X,StartPts.Y].BzMap;
			if CheckInMap(StartPts) and (SaveColor <> 0) then
			begin
				if not(Supported(StartPts)) then
				begin

					if PlaySound then
						begin
							SetVoiceNote(1,((Freq[StartPts.X] + Freq[StartPts.Y]) div 2),250,0);
        			StartSound;
        			WaitSoundState(S_QueueEmpty);
      			end else delay(14);

        	NoneDropped := False;
					repeat
						Erase1Ball(StartPts,SaveColor,0);

						BallMap[StartPts.X,StartPts.Y].BzMap := 0;
						if FlipGate then DropDir := 2 else DropDir := 5;
						FlipGate := not FlipGate;
						SavePts.X := StartPts.X;
						SavePts.Y := StartPts.Y;
						move(SavePts,DropDir);
						if CheckInMap(SavePts)
						and (BallMap[SavePts.X,SavePts.Y].BzMap=0) then
							move(StartPts,DropDir);
						Draw1Ball(StartPts,SaveColor,0);
						BallMap[StartPts.X,StartPts.Y].BzMap := SaveColor;
           	Delay(10);
					until Supported(StartPts);
				end;
			end
	  end
end;{CheckGaps}

function RowLength( RPts : PointType; dir : byte) : byte;
var
	SameCount, i: byte;

begin
	SameCount := 1;
	repeat
		if BallMap[RPts.X,RPts.Y].BzMap=0 then
	  begin
			RowLength := SameCount;
			exit
		end
		else
		begin
			SavePts.X := RPts.X;
			SavePts.Y := RPts.Y;
      Move(SavePts,dir);
			if BallMap[SavePts.X,SavePts.Y].BzMap = SaveColor then
				Inc(SameCount);
		end; {if}
		Move(RPts,dir)
	until not(BallMap[RPts.X,RPts.Y].BzMap = SaveColor);
	RowLength := SameCount;
end;{RowLength}

procedure DeleteList;
var
	n,i,
	image   : byte;
	DrawPts,
	DelPts  : PointType;

begin
	for n := 0 to Index-1 do
	begin
		DelPts.X := MatchList[n].X;
		DelPts.Y := MatchList[n].Y;
		if BallMap[DelPts.X,DelPts.Y].BzMap <> 0 then
		begin
			DrawPts.X := DelPts.X ; DrawPts.Y := DelPts.Y;
			for i := 1 to 2 do
			begin
				Draw1Ball(DrawPts,0,0);

				if PlaySound then
					begin
						SetVoiceNote(1,((Freq[MatchList[n].X] + Freq[MatchList[n].Y]) div 2),250,0);
						StartSound;
						WaitSoundState(S_QueueEmpty);
					end else delay(14);

				Erase1Ball(DrawPts,0,0);
			end;

			image := BallMap[DelPts.X,DelPts.Y].BzMap;
			Erase1Ball(DrawPts,image,0);
			BallMap[DelPts.X,DelPts.Y].BzMap := 0
		end
	end
end;{DeleteList}

procedure Add2List(RPts : PointType; rdir : byte);
begin
	Inc(MatchesDone);
	if TwoPlayer
	then
		Inc(MatchCount[(SaveColor+2)div 3])
	else
		Inc(MatchCount[Player]);
	repeat
		MatchList[Index].X := RPts.X;
		MatchList[Index].Y := RPts.Y;
		Inc(Index);
		move(RPts,rdir)
	until not(BallMap[RPts.X,RPts.Y].BzMap = SaveColor)
end;{Add2List}

procedure MatchColors; { Fred's algorithm for checking color matches }
var
	X,Y		: byte;
begin
	for X := 4 to 20 do
		for Y := 0 to 19 do
		begin
			StartPts.X := X;
			StartPts.Y := Y;
			SaveColor :=	BallMap[StartPts.X,StartPts.Y].BzMap;
			if CheckInMap(StartPts) then
			begin

				SavePts.X := StartPts.X;
				SavePts.Y := StartPts.Y;
				move(SavePts,1);
				if not(BallMap[SavePts.X,SavePts.Y].BzMap = SaveColor) then
				begin
					Length := RowLength(StartPts,4);
					if Length>4 then
					begin
						Add2List(StartPts,4);
						if TwoPlayer
						then
							Inc(SameBonus[(SaveColor+2)div 3],Length-3)
						else
							Inc(SameBonus[Player],Length-3);
					end
				end;

				SavePts.X := StartPts.X;
				SavePts.Y := StartPts.Y;
				move(SavePts,5);
				if not(BallMap[SavePts.X,SavePts.Y].BzMap = SaveColor) then
				begin
					Length := RowLength(StartPts,0);
					if Length>4 then
					begin
						Add2List(StartPts,0);
						if TwoPlayer
						then
							Inc(SameBonus[(SaveColor+2)div 3],Length-3)
						else
							Inc(SameBonus[Player],Length-3);
					end
				end;

				SavePts.X := StartPts.X;
				SavePts.Y := StartPts.Y;
				move(SavePts,2);
				if not(BallMap[SavePts.X,SavePts.Y].BzMap = SaveColor) then
				begin
					Length := RowLength(StartPts,3);
					if Length>4 then
					begin
						Add2List(StartPts,3);
						if TwoPlayer
						then
							Inc(SameBonus[(SaveColor+2)div 3],Length-3)
						else
							Inc(SameBonus[Player],Length-3);
					end
				end;

				SavePts.X := StartPts.X;
				SavePts.Y := StartPts.Y;
				move(SavePts,6);
				if not(BallMap[SavePts.X,SavePts.Y].BzMap = SaveColor) then
				begin
					Length := RowLength(StartPts,11);
					if Length>2 then
					begin
						Add2List(StartPts,11);
						if TwoPlayer
						then
							Inc(SameBonus[(SaveColor+2)div 3],Length-2)
						else
							Inc(SameBonus[Player],Length-2);
					end
				end;

				SavePts.X := StartPts.X;
				SavePts.Y := StartPts.Y;
				move(SavePts,8);
				if not(BallMap[SavePts.X,SavePts.Y].BzMap = SaveColor) then
				begin
					Length := RowLength(StartPts,9);
					if Length>2 then
					begin
						Add2List(StartPts,9);
						if TwoPlayer
						then
							Inc(SameBonus[(SaveColor+2)div 3],Length-2)
						else
							Inc(SameBonus[Player],Length-2);
					end
				end;

				SavePts.X := StartPts.X;
				SavePts.Y := StartPts.Y;
				move(SavePts,7);
				if not(BallMap[SavePts.X,SavePts.Y].BzMap = SaveColor) then
				begin
					Length := RowLength(StartPts,10);
					if Length>2 then
					begin
						Add2List(StartPts,10);
						if TwoPlayer
						then
							Inc(SameBonus[(SaveColor+2)div 3],Length-2)
						else
							Inc(SameBonus[Player],Length-2);
					end
				end;
			end
		end;
end;{MatchColors}

begin{CheckMatches}
	repeat
	DCO:= GetDC(OddWindows);
	MemDCO:= CreateCompatibleDC(DCO);
	TempDCO:= CreateCompatibleDC(DCO);
		Index := 0;
		MatchColors;
		if Index>0 then DeleteList;
		CheckGaps;
		DeleteDC(MemDCO);
		DeleteDC(TempDCO);
		ReleaseDC(OddWindows, DCO);

		if PeekMessage(Messg,0,0,0, pm_remove) then {Only read wm_KeyDown msgs}
				begin
					TranslateMessage(Messg);
					DispatchMessage(Messg);
				end;
	until (Index=0)and NoneDropped;

end;


{ Zip uses the new delay procedure. It only delays if the speaker sound is turned
	off. 14 milliseconds with no sound seems about the same speed as no delay with the
	sound on. I tested this on various speed processors, the playsound loop here seems to take
	approximately the same time to execute as the delay(14) line! Brian S. - 02/16/93
	Note: this is used throughout with every playsound routine.
}
procedure Zip; { Zip Oddballz shape at full speed }

	procedure QuickDraw; {Same as draw but needs device contexts, used with zip}
	var
		i: byte;
	begin
		Drawn:= True; { Added this boolean for redrawscreen procedure - Brian S. }
		with Oddballz do
		begin
			for i := 0 to 3 do
				Draw1Ball(Map[i],Image[i],i)
		end; {with}
	end;{QuickDraw}

	procedure QuickErase; {Same as draw but needs device contexts, used with zip}
	var
		i: byte;
	begin
		Drawn:= True; { Added this boolean for redrawscreen procedure - Brian S. }
		with Oddballz do
		begin
			for i := 3 downto 0 do
				Erase1Ball(Map[i],Image[i],i)
		end; {with}
	end;{QuickErase}

begin
	if MoveOBall (Direction) then
		begin
			ZipBonus := true;
		end;

	DCO:= GetDC(OddWindows);
	MemDCO:= CreateCompatibleDC(DCO);
	TempDCO:= CreateCompatibleDC(DCO);

	while MoveOBall(Direction) do
	begin
	QuickDraw;
		if PlaySound then
			begin
				SetVoiceNote(1,Freq[Oddballz.Map[0].Y],250,0);
				StartSound;
				WaitSoundState(S_QueueEmpty);
			end
		else delay(14);

	QuickErase;
	end;{while}

	DeleteDC(MemDCO);
	DeleteDC(TempDCO);
	ReleaseDC(OddWindows, DCO);
end;

procedure RotColors; { Rotates the colors through the Oddballz shape }
var
	i,
	SaveColor	: byte;
begin
	with Oddballz do
	begin
		SaveColor := Image[0];
		for i := 0 to 2 do
			Image[i] := Image[i+1];
		Image[3] := SaveColor
	end; {with}
end;


procedure EmptyScreen; { Empties the Oddballz Playfield }

begin
	DCO:= GetDC(OddWindows);
	MemDCO := CreateCompatibleDC(DCO);
	TempDCO:= CreateCompatibleDC(DCO);
	OldPalette:= SelectPalette(DCO, OddBallzPalette, False);
	SelectPalette(MemDCO, OddBallzPalette, False);
	RealizePalette(DCO);
	RealizePalette(MemDCO);
	OldBitmap := SelectObject(MemDCO, PlayScreenBmp);
	BitBlt(DCO, 0, 0, SWidth, SHeight, MemDCO, 0, 0, srcCopy);
	SelectObject(MemDCO, OldBitmap);
	SelectPalette(DCO, OldPalette, False);
	SelectPalette(MemDCO, OldPalette, False);
	RealizePalette(DCO);
	RealizePalette(MemDCO);
	DeleteDC(MemDCO);
	DeleteDC(TempDCO);
	ReleaseDC(Oddwindows,DCO);
end;


procedure RedrawGame; { Redraws the Playfield }
begin
	EmptyScreen;
	UpdateScore;
	TogglePlayField;
	if drawn then draw; { Because everything is erased, we want to draw the }
											{ shape only if it was drawn. }
end;


procedure Pauser; { This is a new pause routine for Windows - Brian S. }
var
	Messg: TMsg;
begin
	if enough then exit; { if gameover then don't execute pause routine }
	pauseflag:= True;
	EmptyScreen;
	UpdateScore;
	erase;
	DCO:= GetDC(OddWindows);
	MemDCO := CreateCompatibleDC(DCO);
	TempDCO:= CreateCompatibleDC(DCO);

	OldBitmap:= SelectObject(MemDCO, pausebitmapmask); {mask paused}
	BitBlt(DCO, 76, 90, PWidth, PHeight, MemDCO, 0, 0, srcAnd);
	SelectObject(MemDCO, pausebitmap);
	BitBlt(DCO, 76, 90, PWidth, PHeight, MemDCO, 0, 0, srcInvert);
	SelectObject(MemDCO, OldBitmap);

	DeleteDC(MemDCO);
	DeleteDC(TempDCO);
	ReleaseDC(Oddwindows,DCO);

	while Pauseflag do
		begin
			if PeekMessage(Messg,0,0,0, pm_remove) then {Only read wm_KeyDown msgs}
				if (TranslateAccelerator (OddWindows, HAccel, Messg)) = 0 then
					begin
						TranslateMessage(Messg);
						DispatchMessage(Messg);
					end;
		end;

	if PauseQuit then exit; { if window is closed using system menu while paused }
	drawn:= true;
  RedrawGame;
  pauseflag:= False;
end;


procedure DoLost;
var
	i: integer;

begin
	if PlaySound then
  		if PlaySound then
			for i := 84 downto 1 do
			begin
				SetVoiceNote(1,i,250,0);
        StartSound;
        WaitSoundState(S_QueueEmpty);
			end;
end;


procedure CheckAdvance;
var
	i	: byte;
begin
	if LevCol > 0 then { Change the level text color for 5 moves }
		Dec(LevCol);
	
	if ZipBonus then Inc(Score[Player],2);
	ZipBonus := false;
	if RowCount>0 then
	begin
  	if RowCount>10 then RowCount:= 10;
		Inc(Score[Player],Two2N(RowCount));
		Inc(Rows,RowCount);
		RowCount := 0;
		Skill[Player] := (Score[Player]*10) div BallCount[Player]
	end;
  if not(TwoPlayer) then
	begin
		if MatchCount[Player]>0 then
		begin
    	if MatchCount[Player]>10 then MatchCount[Player]:= 10;
			Inc(Score[Player],Two2N(MatchCount[Player]));
			MatchCount[Player] := 0;
			Inc(Score[Player],SameBonus[Player]);
			SameBonus[Player] := 0;
			Skill[Player] := (Score[Player]*10) div BallCount[Player]
		end
	end
	else
		for i := 1 to 2 do
			if MatchCount[i]>0 then
			begin
				Inc(Score[i],Two2N(MatchCount[i]));
				MatchCount[i] := 0;
				Inc(Score[i],SameBonus[i]);
				SameBonus[i] := 0;
				Skill[i] := (Score[i]*10) div BallCount[i]
			end;
	if ((MatchesDone>11) or (Rows>5)) and (Level< 50) then { Max Level is 50 }
	begin
		inc(Level);
		MatchesDone := 0;
		Rows := 0;
    LevCol:= 5;
		if PlaySound then
			for i := 1 to 84 do
			begin
      	SetVoiceNote(1,i,250,0);
        StartSound;
        WaitSoundState(S_QueueEmpty);
      end;

		with LevAttr[Level] do
		begin
			Shapes := LShapes;
			NewLevel := 1;
			Pausetime := LDelay;
			if TwoPlayer then Colors := 3 else Colors := LColors;
			if Matcher then InitColorInc
		end
	end
end;


procedure DoKey; { This procedure was rewritten for Windows - Brian S. }
var
	Key				: longint;
	IsFunc		: boolean;
	dummy			: boolean;
	ch				: char;
 	Messg			: TMsg;

begin
	if PeekMessage(Messg,OddWindows,wm_keydown,wm_keydown, pm_remove) then {Only read wm_KeyDown msgs}
		if (TranslateAccelerator (OddWindows, HAccel, Messg)) = 0 then
			begin
				TranslateMessage(Messg);
    		DispatchMessage(Messg);
 			end;

  If (Messg.message = wm_KeyDown) then
		Key:= Messg.wParam
  else
  	Key := 0;

  If ((Messg.lParam) and 255) > 1 then key:= 0;


	if Key <> 0 then
	begin
		Erase;
		case Key of
			VK_NUMPAD0, VK_INSERT		: RotColors;
			VK_LEFT  			: dummy := MoveOBall(1);
			VK_RIGHT 			: dummy := MoveOBall(4);

			VK_UP  				: Transform(@RotCCW); 
			VK_DOWN				: Transform(@RotCW);
			VK_HOME 			: Transform(@FlipX);
			VK_END  			: Transform(@FlipY);
			VK_SPACE			: Zip;

			$46		: RotColors; { F }
			$44  	: dummy := MoveOBall(1); { D }
			$47 	: dummy := MoveOBall(4); { G }

			$52  	: Transform(@RotCCW); { R }
			$56		: Transform(@RotCW); { V }
			$58 	: Transform(@FlipX); { X }
			$59  	: Transform(@FlipY); { Y }
		end; {case}
    Draw;
	end;

	if endgame then { game forced to end by user }
	begin
		Drawn:= True;
		enough:= true; 
		DoLost; 
    exit;
  end;
end;

procedure Play;
	{ The main game loop. This was modified a bit for Windows - Brian S. }
var
	i,
	MoveTime : byte;
	Messg: TMsg;

begin
  Build;
	UpdateScore;
	Draw;
	MoveTime := 0;

	While not enough do
  begin
    if MoveTime = 8 then
		begin
			MoveTime := 0;
			Erase;

			if not MoveOBall(Direction) then
				begin
					Stamp;
					if Matcher then CheckMatches else
						CheckRows;
					CheckAdvance;
					if GameOver then
						begin
							Drawn:= False;
							DoLost;
							EndGame:= True; { so game doesn't quit executing }
							exit;
						end else
							Build;
					UpdateScore;
				end;

			if PlaySound then
				begin
					SetVoiceNote(1,Freq[Oddballz.Map[0].Y],250,0);
					StartSound;
					WaitSoundState(S_QueueEmpty);
				end else
					delay(14);

		if not GameOver then Draw;
		end; {if}

		Delay(PauseTime);
    DoKey;
		Inc(MoveTime);
	if PeekMessage(Messg,0,0,0, pm_remove) then {Only read wm_KeyDown msgs}
  	if (TranslateAccelerator (OddWindows, HAccel, Messg)) = 0 then
 			begin
				TranslateMessage(Messg);
    		DispatchMessage(Messg);
 			end;


		if (LostFocusFlag) and (not enough) then pauser;
    		{ Pause Game, see lostfocus & gotfocus methods }
	end; { While }

end; { Play }


procedure oddbegin;

begin { program body }
	Enough:= False;	{Must only init enough and engame to false while starting a new game}
	EndGame:= False;{so the main program knows what's going on and can control the unit.}

	InitOBall;
	RedrawGame;
	EmptyScreen;
	UpdateScore;
	Play;
end;

begin
end.
