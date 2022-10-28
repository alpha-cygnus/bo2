import {useCallback, useEffect, useState} from "react";

type WallProps = {
  className: string;
  start: [number, number]
  lens: number[];
}

function RectPath({start: [sx, sy], lens, className}: WallProps) {
  let d = `M${sx},${sy}`;
  for (let i = 0; i < lens.length; i += 2) {
    const lx = lens[i];
    const ly = lens[i + 1];
    d += `l${lx},0 l0,${ly}`;
  }
  return <path className={className} d={d} />
}

type PlaceProps = {
  className?: string;
  x?: number;
  y?: number;
  deg?: number;
  children: any;
}

function Place({className, x = 0, y = 0, deg = 0, children}: PlaceProps) {
  return <g
    className={className}
    transform={`translate(${x},${y}) rotate(${deg})`}
  >
    {children}
  </g>;
}

function Fredde() {
  return <RectPath className="fredde" start={[-900, 0]} lens={[1800, 740, -1800, -740]} />;
}

function Spkr30() {
  return <RectPath className="fredde" start={[-150, 150]} lens={[300, 300, -300, -300]} />;
}

function Markus() {
  return <circle className="markus" x={0} y={0} r={500} />;
}

function YandexTV50() {
  return <path
    className="tv"
    d={`M${-1111/2},${0}l1111,0 l0,284 l-1111,0 l0,-284`}
  />
}

function QBed() {
  return <RectPath
    className="q-bed"
    start={[-1920/2, 0]}
    lens={[1920, 2160, -1920, -2160]}
  />
}

const W1=80;
const SB = {
  minx: -300,
  width: 15000,
  miny: -300,
  height: 12000,
};

function RulerText({d, href}: {d: number, href: string}) {
  return <text>
    <textPath
      href={href}
      startOffset="50%"
      className="ruler-text"
    >
      {Math.abs(d).toFixed(0)}
    </textPath>
  </text>;
}

type RulerData = {
  from: [number, number];
  to: [number, number];
};

function Ruler({from, to}: RulerData) {
  const [x0, y0] = from;
  const [x1, y1] = to;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const d = Math.sqrt(dx*dx + dy*dy);
  return <g className="ruler">
    <circle cx={x0} cy={y0} r={50} />
    <path id="ruler-diag" className="ruler" d={`M${from.join(',')} L${to.join(',')}`} />
    <RulerText href="#ruler-diag" d={d} />
    <path id="ruler-top" className="ruler-top" d={`M${x0},${y0} L${x1},${y0}`} />
    <path id="ruler-bot" className="ruler-bot" d={`M${x0},${y1} L${x1},${y1}`} />
    <path id="ruler-right" className="ruler-top" d={`M${x1},${y0} L${x1},${y1}`} />
    <path id="ruler-left" className="ruler-left" d={`M${x0},${y0} L${x0},${y1}`} />
    <RulerText href="#ruler-top" d={dx} />
    <RulerText href="#ruler-right" d={dy} />
    <circle cx={x1} cy={y1} r={50} />
  </g>
}

export function Apt() {
  const [down, setDown] = useState<[number, number] | null>(null);
  const [ruler, setRuler] = useState<RulerData | null>(null);
  const [svg, setSvg] = useState<SVGSVGElement | null>(null);

  const onDown = useCallback((e) => {
    setDown([e.clientX, e.clientY]);
    setRuler(null);
  }, []);

  const toSVGxy = useCallback(([x, y]: [number, number]): [number, number] => {
    if (!svg) return [0, 0];
    const {left, top, width, height} = svg.getBoundingClientRect();
    return [
      (x - left) / width * SB.width + SB.minx,
      (y - top) / height * SB.height + SB.miny,
    ]
  }, [svg]);

  useEffect(() => {
    if (!down) return;
    const up = () => {
      setDown(null);
    }
    const move = (e: MouseEvent) => {
      setRuler({from: toSVGxy(down), to: toSVGxy([e.clientX, e.clientY])});
    }
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);

    return () => {
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    }
  }, [down, toSVGxy]);

  useEffect(() => {
    console.log(ruler?.from, ruler?.to);
  }, [ruler]);

  return (
    <div className="plan">
    <svg
      version="1.1"
      baseProfile="full"
      viewBox={`${SB.minx} ${SB.miny} ${SB.width} ${SB.height}`}
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => console.log(e)}
      onMouseDown={onDown}
      ref={setSvg}
    >
      <Place className="room" key="living">
        <RectPath
          className="room-floor"
          start={[0,268]}
          lens={[
            1840, -268,
            840+1923+417, 1531,
            155, 1500,
            -1573, 596,
            -3614, -842-723-176-1024-593,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[0, 268]}
          lens={[
            1840, -268,
            840, -300,
            -840-1840-300, 300+268+593,
            300, 593,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[4603,-300]}
          lens={[
            417+155+W1, 300+3031,
            -W1, -1500,
            -155, -1531,
            -417, -300,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[5175,3030]}
          lens={[
            W1, W1,
            -W1-319, -W1,
            319, 0,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[-300,2784]}
          lens={[
            300, 842,
            3610, -596,
            450, W1,
            -450 + W1, 596,
            -W1-3610-300, -842,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[-300,1885]}
          lens={[
            300, 176, -300, -176,
          ]}
        />
      </Place>

      <Place key="study" className="room" x={5175 + W1}>
        <RectPath
          className="room-floor"
          start={[0, 0]}
          lens={[
            3655, 3030,
            -3655, -3030,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[0, 0]}
          lens={[
            1008, -300,
            -1008-W1, 300+3030+W1,
            450, -W1,
            -400, -3030,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[1008+729, 0]}
          lens={[
            170, -300,
            -170, 300,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[1008+720+170+1027, 0]}
          lens={[
            721, 3030,
            -2427, W1,
            2427+W1, -W1-3030-300,
            -W1-721, 300,
          ]}
        />
        <Place x={3655} y={1515} deg={90}>
          <Fredde />
        </Place>
        <Place x={3655 - 2427/2} y={1515}>
          <Markus />
        </Place>
        <Place x={3655 - 2427/2} y={3030} deg={180}>
          <YandexTV50 />
        </Place>
        <Place x={3655 - 2427/2 - 800} y={3030 - 500} deg={30}>
          <Spkr30 />
        </Place>
        <Place x={3655 - 2427/2 + 800} y={3030 - 500} deg={-30}>
          <Spkr30 />
        </Place>
      </Place>

      <Place key="kitchen" className="room" x={5175+W1+3655+W1}>
        <RectPath
          className="room-floor"
          start={[160, 0]}
          lens={[
            3485-160, 6308,
            -3485, -6308+1582,
            160, -1582,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[160, 0]}
          lens={[
            712, -300,
            -712-160-W1, 300+3030+W1,
            W1, -(3030-W1-1582),
            160, -1582,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[3485-689, 0]}
          lens={[
            698, 6308,
            -3485, -1734,
            -W1, 1734+W1+620,
            W1, -620,
            3485+300, -W1-6308-300,
            -300-689, 300,
          ]}
        />
      </Place>

      <Place key="children" className="room" y={3626+W1}>
        <RectPath
          className="room-floor"
          start={[0, 0]}
          lens={[
            3610, 3252,
            -1120, -160,
            -2490, -3252+160,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[0, 0]}
          lens={[
            3610, 400,
            W1, -400-W1,
            -W1-3610-300, 752+W1,
            300, -752,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[-300, 3252-412-160]}
          lens={[
            300, 412,
            2490, 160,
            1120, -2048,
            W1, 2048+W1,
            -W1-3610-300, -W1-160-412,
          ]}
        />
      </Place>

      <Place key="bedroom" className="room" y={3626+W1+3252+W1}>
        <RectPath
          className="room-floor"
          start={[0, 0]}
          lens={[
            3786+800+150, 3349-1846-W1,
            -(3786+800+150-4392), 1846+W1,
            -4392, -3349,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[0, 0]}
          lens={[
            3786, -W1,
            -3786-300, 714,
            300, -714,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[3786 + 800, 0]}
          lens={[
            150, 600,
            W1, -600-W1,
            -W1-150, W1,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[-300, 3349-702]}
          lens={[
            300, 702,
            4392, -1846,
            -600, -W1,
            600+W1+300, W1,
            -300, 1846+W1+300,
            -W1-4392-300, -300-702,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[-300, 714+1023]}
          lens={[
            300, 183,
            -300, -183,
          ]}
        />
        <Place x={3786/2} y={0}>
          <QBed />
        </Place>
      </Place>

      <Place key="bedroom-closet" className="room" x={3786+800+150} y={3626+W1+3252+W1}>
        <RectPath
          className="room-floor"
          start={[W1, 0]}
          lens={[
            1620, -180,
            400, 1340,
            -600, 270,
            -1620-400+600-W1, -(1340-180+270-600),
            W1, -600,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[W1, 0]}
          lens={[
            1620, -180,
            400, 1340,
            -600, 270,
            -645, W1,
            645+600+W1+200, -W1-270,
            -200, -1340-W1,
            -400-1620+40, 150,
            -345, W1,
            150, 600,
            W1, -600,
          ]}
        />
      </Place>

      <Place key="entrance-closet" className="room" x={5175+W1+3655+W1} y={6308+W1}>
        <RectPath
          className="room-floor"
          start={[0, 0]}
          lens={[
            1570, 1230+620,
            -1570-W1, -1230,
            W1, -620,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[1570, 1230+620-640]}
          lens={[
            W1, 640+300,
            -3680+200+1000-W1, -300,
            3680-200-1000, -640,
          ]}
        />
        <RectPath
          className="room-wall"
          start={[1570, 0]}
          lens={[
            W1, 500,
            -W1, -500,
          ]}
        />
      </Place>

      {ruler && <Ruler {...ruler} />}
    </svg>
    </div>
  );
}

export function App() {
  return <Apt />;
}
