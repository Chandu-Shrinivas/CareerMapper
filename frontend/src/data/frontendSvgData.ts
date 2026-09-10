// Generated from source-of-truth roadmap.sh Frontend HTML geometry
export interface SvgEdge {
  kind: 'path';
  d: string;
  stroke?: string | null;
  strokeWidth?: string | null;
  strokeDasharray?: string | null;
  strokeLinecap?: string | null;
  strokeLinejoin?: string | null;
  dataEdgeId?: string | null;
}

export interface SvgCircle {
  kind: 'circle';
  cx: string | number;
  cy: string | number;
  r: string | number;
  fill: string;
  id?: string | null;
}

export interface SvgChildElement {
  kind?: string;
  tag: string;
  id?: string | null;
  x?: string | number | null;
  y?: string | number | null;
  dy?: string | number | null;
  width?: string | number | null;
  height?: string | number | null;
  rx?: string | number | null;
  fill?: string | null;
  stroke?: string | null;
  strokeWidth?: string | null;
  style?: string | null;
  textAnchor?: string | null;
  dominantBaseline?: string | null;
  fontSize?: string | null;
  text?: string | null;
  x1?: string | number | null;
  y1?: string | number | null;
  x2?: string | number | null;
  y2?: string | number | null;
  cx?: string | number | null;
  cy?: string | number | null;
  r?: string | number | null;
  d?: string | null;
  strokeLinecap?: string | null;
  strokeLinejoin?: string | null;
  dataNodeId?: string | null;
  dataType?: string | null;
  dataTitle?: string | null;
  dataParentId?: string | null;
  dataParentTitle?: string | null;
  dataLink?: string | null;
  [key: string]: any;
  tspans?: Array<{
    x?: string | null;
    y?: string | null;
    dy?: string | null;
    textAnchor?: string | null;
    dominantBaseline?: string | null;
    fontSize?: string | null;
    fill?: string | null;
    text?: string;
  }>;
  children?: SvgChildElement[];
}

export interface SvgNodeGroup {
  kind: 'g';
  dataNodeId?: string | null;
  dataType?: string | null;
  dataTitle?: string | null;
  dataParentId?: string | null;
  dataParentTitle?: string | null;
  dataLink?: string | null;
  children: SvgChildElement[];
}

export type SvgElementItem = SvgEdge | SvgCircle | SvgNodeGroup;

export const FRONTEND_SVG_VIEWBOX = "-675 -312 1097 3995";

export const FRONTEND_SVG_DATASET: SvgElementItem[] = [
  {
    "kind": "path",
    "d": "M-116.95655064838832,-32.59925177765109 C-116.95655064838832,17.835527822125528 -116.95655064838832,17.835527822125528 -116.95655064838832,68.27030742190215",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "tNkdpQjYu72eFK9f_W0RO"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,92.77030742190215 C44.64223808161799,92.77030742190215 44.64223808161799,-70.22969257809785 86.2410268116243,-70.22969257809785",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "ronTDxAvatzbk4n5a-McM"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,92.77030742190215 C44.64223808161799,92.77030742190215 44.64223808161799,-16.229692578097854 86.2410268116243,-16.229692578097854",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "gaNQ1Peug0eiN0Bfxhtgw"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,92.77030742190215 C44.64223808161799,92.77030742190215 44.64223808161799,37.770307421902146 86.2410268116243,37.770307421902146",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "351utcB2QNjRmDe5bmcD1"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,92.77030742190215 C44.64223808161799,92.77030742190215 44.64223808161799,91.77030742190215 86.2410268116243,91.77030742190215",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "lupNr9zUQ0sXyzPBxcglQ"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,92.77030742190215 C44.64223808161799,92.77030742190215 44.64223808161799,145.77030742190215 86.2410268116243,145.77030742190215",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "2IVWwbU20VSU47qjiVU-f"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,92.77030742190215 C44.64223808161799,92.77030742190215 44.64223808161799,199.77030742190215 86.2410268116243,199.77030742190215",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "9MbeqIRipRgbe34jwalxo"
  },
  {
    "kind": "path",
    "d": "M-532.0903733522699,3018.724470475211 C-532.0903733522699,3044.9828540774324 -532.0903733522699,3044.9828540774324 -532.0903733522699,3071.2412376796533",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "reactflow__edge-ruoFa3M4bUE3Dg6GXSiUIx2-Hk8AVonOd693_y1sykPqdw1"
  },
  {
    "kind": "path",
    "d": "M-116.95655064838832,117.27030742190215 C-116.95655064838832,147.77030742190215 -116.95655064838832,147.77030742190215 -116.95655064838832,178.27030742190215",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__VlNNwIEDWqQXtqkHWJYzCx2-yWG2VUkaF5IJVVut6AiSyw1"
  },
  {
    "kind": "path",
    "d": "M-116.95655064838832,333.27030742190215 C-116.95655064838832,358.8806200818468 -116.95655064838832,358.8806200818468 -116.95655064838832,384.49093274179154",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__ODcfFEorkfJNupoQygM53x2-NIY7c4TQEEHx0hATu-k5Cw1"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,408.99093274179154 C-324.5234620003291,408.99093274179154 -324.5234620003291,408.99093274179154 -412.0903733522699,408.99093274179154",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__NIY7c4TQEEHx0hATu-k5Cy2-R_I4SGYqLk5zze5I1zS_Ez1"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,461.99093274179154 C-324.5234620003291,461.99093274179154 -324.5234620003291,461.99093274179154 -412.0903733522699,461.99093274179154",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__MXnFhZlNB1zTsBFDyni9Hy2-qmTVMJDsEhNIkiwE_UTYuz2"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,461.99093274179154 C82.61152226243462,461.99093274179154 82.61152226243462,461.99093274179154 162.17959517325755,461.99093274179154",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__MXnFhZlNB1zTsBFDyni9Hz2-IqvS1V-98cxko3e9sBQgPy1"
  },
  {
    "kind": "path",
    "d": "M282.17959517325755,486.49093274179154 C282.17959517325755,517.1078812889272 282.17959517325755,517.1078812889272 282.17959517325755,547.7248298360628",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__IqvS1V-98cxko3e9sBQgPx2-XDTD8el6OwuQ55wC-X4iVw1"
  },
  {
    "kind": "path",
    "d": "M282.17959517325755,596.7248298360628 C282.17959517325755,614.9975686289824 282.17959517325755,614.9975686289824 282.17959517325755,633.2703074219021",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__XDTD8el6OwuQ55wC-X4iVx2-eghnfG4p7i-EDWfp3CQXCw2"
  },
  {
    "kind": "path",
    "d": "M-116.95655064838832,666.2703074219021 C-116.95655064838832,702.667569314612 -116.95655064838832,702.667569314612 -116.95655064838832,739.064831207322",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__DI8pvEosrUU7lcaGa7-Kcx2-eXezX7CVNyC1RuyU_I4yPw1"
  },
  {
    "kind": "path",
    "d": "M-113.70798467806267,1533.5557520139007 C-113.70798467806267,1556.826191436914 -113.70798467806267,1556.826191436914 -113.70798467806267,1580.0966308599275",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__hkSc_1x09m7-7BO7WzlDTx2-0Awx3zEI5_gYEIrD7IVX6w2"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,2077.114686047012 C279.49718479195076,2043.4229265428785 279.49718479195076,2043.4229265428785 279.49718479195076,2009.731167038745",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__RDWbG3Iui6IPgp0shvXtgw2-JanR7I_lNnUCXhCMGLdn-x1"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,2126.114686047012 C279.49718479195076,2212.60362928108 279.49718479195076,2212.60362928108 279.49718479195076,2299.092572515148",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__RDWbG3Iui6IPgp0shvXtgx2-Cxspmb14_0i1tfw-ZLxEuw2"
  },
  {
    "kind": "path",
    "d": "M159.49718479195076,2323.592572515148 C120.38761779705226,2323.592572515148 120.38761779705226,2323.592572515148 81.27805080215374,2323.592572515148",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__Cxspmb14_0i1tfw-ZLxEuy2-a8oOlkyM_C8vHuHqeiOAKz1"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,2348.092572515148 C279.49718479195076,2422.534966180013 279.49718479195076,2422.534966180013 279.49718479195076,2496.977359844878",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__Cxspmb14_0i1tfw-ZLxEux2-n0q32YhWEIAUwbGXexoqVw1"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,2545.977359844878 C279.49718479195076,2577.8777947187937 279.49718479195076,2577.8777947187937 279.49718479195076,2609.778229592709",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__n0q32YhWEIAUwbGXexoqVx2-iUxXq7beg55y76dkwhM13w2"
  },
  {
    "kind": "path",
    "d": "M-412.0903733522699,2800.2125572601244 C-322.8991790151663,2800.2125572601244 -322.8991790151663,2749.2125572601244 -233.70798467806267,2749.2125572601244",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__ap4h4v5Sr4jBH3GwWSH8xz2-JWU9jc12_ewaIKt3qWLcpy1"
  },
  {
    "kind": "path",
    "d": "M-412.0903733522699,2800.2125572601244 C-322.8991790151663,2800.2125572601244 -322.8991790151663,2696.2125572601244 -233.70798467806267,2696.2125572601244",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__ap4h4v5Sr4jBH3GwWSH8xz2-dz7_QXoO7X0WmS5xuAhhJy1"
  },
  {
    "kind": "path",
    "d": "M-412.0903733522699,2800.2125572601244 C-322.8991790151663,2800.2125572601244 -322.8991790151663,2802.2125572601244 -233.70798467806267,2802.2125572601244",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__ap4h4v5Sr4jBH3GwWSH8xz2-66ya3WdtlkjQyBTc3Leiny1"
  },
  {
    "kind": "path",
    "d": "M-412.0903733522699,2800.2125572601244 C-322.8991790151663,2800.2125572601244 -322.8991790151663,2908.2125572601244 -233.70798467806267,2908.2125572601244",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__ap4h4v5Sr4jBH3GwWSH8xz2-FyNXhHq1VIASNq-LI7JIuy1"
  },
  {
    "kind": "path",
    "d": "M-412.0903733522699,2994.224470475211 C-323.3780483778115,2994.224470475211 -323.3780483778115,2994.224470475211 -234.66572340335313,2994.224470475211",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__ruoFa3M4bUE3Dg6GXSiUIz2-L7AllJfKvClaam3y-u6DPy1"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,3166.347585709834 C279.49718479195076,3208.5525844226822 279.49718479195076,3208.5525844226822 279.49718479195076,3250.75758313553",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__PoM77O2OtxPELxfrW1wtlx2-VOGKiG2EZVfCBAaa7Df0Ww2"
  },
  {
    "kind": "path",
    "d": "M-113.70798467806267,2545.977359844878 C-113.70798467806267,2567.8777947187937 -113.70798467806267,2567.8777947187937 -113.70798467806267,2589.778229592709",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__NQ95TJCe3E1IwEuBa__D6x2-6kWlgayUZQnr9z88fUOkkw1"
  },
  {
    "kind": "path",
    "d": "M-412.0903733522699,2800.2125572601244 C-322.8991790151663,2800.2125572601244 -322.8991790151663,2855.2125572601244 -233.70798467806267,2855.2125572601244",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__6d8cjWZ4BuUjwT0seiuzJz2-tWDmeXItfQDxB8Jij_V4Ly1"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,3299.75758313553 C279.49718479195076,3322.429557852588 279.49718479195076,3322.429557852588 279.49718479195076,3345.1015325696467",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__VOGKiG2EZVfCBAaa7Df0Wx2-dsTegXTyupjS8iU6I7Xivw1"
  },
  {
    "kind": "path",
    "d": "M6.292015321937328,3275.25758313553 C82.89460005694404,3275.25758313553 82.89460005694404,3275.25758313553 159.49718479195076,3275.25758313553",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__KMA7NkxFbPoUDtFnGBFnjz2-VOGKiG2EZVfCBAaa7Df0Wy1"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,1389.2123796484323 C-324.5234620003291,1389.2123796484323 -324.5234620003291,1283.2123796484323 -412.0903733522699,1283.2123796484323",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__MdYPIf_9ezbIp6Dm5Fymey2-Bic4PHhz-YqzPWRimJO83z1"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,1389.2123796484323 C-324.5234620003291,1389.2123796484323 -324.5234620003291,1336.2123796484323 -412.0903733522699,1336.2123796484323",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__MdYPIf_9ezbIp6Dm5Fymey2--ye5ZtYFDoYGpj-UJaBP8z1"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,1389.2123796484323 C-324.5234620003291,1389.2123796484323 -324.5234620003291,1389.2123796484323 -412.0903733522699,1389.2123796484323",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__MdYPIf_9ezbIp6Dm5Fymey2-Lw2nR7x8PYgq1P5CxPAxiz1"
  },
  {
    "kind": "path",
    "d": "M-116.95655064838832,1311.7123796484323 C-116.95655064838832,1338.2123796484323 -116.95655064838832,1338.2123796484323 -116.95655064838832,1364.7123796484323",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__xL8d-uHMpJKwUvT8z-Jiax2-MdYPIf_9ezbIp6Dm5Fymew2"
  },
  {
    "kind": "path",
    "d": "M-116.95655064838832,1112.7123796484323 C-116.95655064838832,1134.7123796484323 -116.95655064838832,1134.7123796484323 -116.95655064838832,1156.7123796484323",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__Gv_g4gK6pZK6l_0xAn34Xx2-e4j6u0e_WqK1vfrUwJJ4Mw2"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,763.564831207322 C95.77031707178122,763.564831207322 95.77031707178122,763.564831207322 188.49718479195076,763.564831207322",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__eXezX7CVNyC1RuyU_I4yPz2-flwf3QbJioovtOpMw4oboy1"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,911.573788906631 C279.49718479195076,936.573788906631 279.49718479195076,936.573788906631 279.49718479195076,961.573788906631",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "80dkO5pGnkuPx2N_LA5ao"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,784.564831207322 C279.49718479195076,823.5693100569765 279.49718479195076,823.5693100569765 279.49718479195076,862.573788906631",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__flwf3QbJioovtOpMw4obox2-UTupdqjOyLh7-56_0SXJ8w1"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,1116.5737889066309 C279.49718479195076,1143.193756649519 279.49718479195076,1143.193756649519 279.49718479195076,1169.8137243924068",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__Nx7mjvYgqLpmJ0_iSx5ofx2-0TMdly8yiqnNR8sx36iqcw1"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,924.8429110844087 C-325.0676004038154,924.8429110844087 -325.0676004038154,899.9210937030621 -413.17865015924247,899.9210937030621",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__ipcNHz8KbfpE57kNP15hPy2-CKlkVK_7GZ7xzIUHJqZr8z1"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,924.8429110844087 C-325.0676004038154,924.8429110844087 -325.0676004038154,1005.9210937030621 -413.17865015924247,1005.9210937030621",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__ipcNHz8KbfpE57kNP15hPy2-E7-LveK7jO2npxVTLUDfwz1"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,924.8429110844087 C-325.0676004038154,924.8429110844087 -325.0676004038154,846.9210937030621 -413.17865015924247,846.9210937030621",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__ipcNHz8KbfpE57kNP15hPy2-RcC1fVuePQZ59AsJfeTdRz1"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,924.8429110844087 C-325.0676004038154,924.8429110844087 -325.0676004038154,952.9210937030621 -413.17865015924247,952.9210937030621",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__ipcNHz8KbfpE57kNP15hPy2-HQrxxDxKN8gizvXRU5psWz1"
  },
  {
    "kind": "path",
    "d": "M-116.95655064838832,788.064831207322 C-116.95655064838832,844.2038711458654 -116.95655064838832,844.2038711458654 -116.95655064838832,900.3429110844087",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__eXezX7CVNyC1RuyU_I4yPx2-ipcNHz8KbfpE57kNP15hPw2"
  },
  {
    "kind": "path",
    "d": "M-116.95655064838832,949.3429110844087 C-116.95655064838832,1006.5276453664205 -116.95655064838832,1006.5276453664205 -116.95655064838832,1063.7123796484323",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__ipcNHz8KbfpE57kNP15hPx2-Gv_g4gK6pZK6l_0xAn34Xw2"
  },
  {
    "kind": "path",
    "d": "M-236.95655064838832,1088.2123796484323 C-324.5234620003291,1088.2123796484323 -324.5234620003291,1088.2123796484323 -412.0903733522699,1088.2123796484323",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__Gv_g4gK6pZK6l_0xAn34Xy2-k4hMVVBMatedUq5EKiMo4z1"
  },
  {
    "kind": "path",
    "d": "M-412.0903733522699,1181.2123796484323 C-324.5234620003291,1181.2123796484323 -324.5234620003291,1181.2123796484323 -236.95655064838832,1181.2123796484323",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__vpimgXt10UQFBDVHR21IUz2-e4j6u0e_WqK1vfrUwJJ4My1"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,1389.2123796484323 C93.02031707178122,1389.2123796484323 93.02031707178122,1389.2123796484323 182.99718479195076,1389.2123796484323",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__MdYPIf_9ezbIp6Dm5Fymez2-flwf3QbJioovtOpMw4oboy2"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,1533.5557520139007 C279.49718479195076,1558.5557520139007 279.49718479195076,1558.5557520139007 279.49718479195076,1583.5557520139007",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "gDaHwD02syERRV6JY77PH"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,1410.2123796484323 C279.49718479195076,1447.3840658311665 279.49718479195076,1447.3840658311665 279.49718479195076,1484.5557520139007",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__flwf3QbJioovtOpMw4obox2-9VcGfDBBD8YcKatj4VcH1w1"
  },
  {
    "kind": "path",
    "d": "M159.4971847919508,1509.0557520139007 C82.89460005694406,1509.0557520139007 82.89460005694406,1509.0557520139007 6.292015321937328,1509.0557520139007",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__9VcGfDBBD8YcKatj4VcH1y2-hkSc_1x09m7-7BO7WzlDTz2"
  },
  {
    "kind": "path",
    "d": "M-233.70798467806267,1509.0557520139007 C-322.8991790151663,1509.0557520139007 -322.8991790151663,1509.0557520139007 -412.0903733522699,1509.0557520139007",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__hkSc_1x09m7-7BO7WzlDTy2-U5mD5FmVx7VWeKxDpQxB5z1"
  },
  {
    "kind": "path",
    "d": "M-532.0903733522699,1533.5557520139007 C-532.0903733522699,1693.1338022933658 -532.0903733522699,1693.1338022933658 -532.0903733522699,1852.7118525728308",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__U5mD5FmVx7VWeKxDpQxB5x2-igg4_hb3XE3vuvY8ufV-4w1"
  },
  {
    "kind": "path",
    "d": "M-532.0903733522699,1901.7118525728308 C-532.0903733522699,1920.1498339748873 -532.0903733522699,1920.1498339748873 -532.0903733522699,1938.5878153769438",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__igg4_hb3XE3vuvY8ufV-4x2-hVQ89f6G0LXEgHIOKHDYqw2"
  },
  {
    "kind": "path",
    "d": "M-116.95655064838832,2013.9769147243353 C-116.95655064838832,2045.5458003856738 -116.95655064838832,2045.5458003856738 -116.95655064838832,2077.114686047012",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__ydZRVWQrJUl3LZfjhR8QTx2-3HgiMfqihjWceSxd6ei8sw1"
  },
  {
    "kind": "path",
    "d": "M3.0434493516116845,2101.614686047012 C81.27031707178122,2101.614686047012 81.27031707178122,2101.614686047012 159.49718479195076,2101.614686047012",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__3HgiMfqihjWceSxd6ei8sz2-RDWbG3Iui6IPgp0shvXtgy1"
  },
  {
    "kind": "path",
    "d": "M159.49718479195076,2521.477359844878 C82.89460005694404,2521.477359844878 82.89460005694404,2521.477359844878 6.292015321937328,2521.477359844878",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__n0q32YhWEIAUwbGXexoqVy2-NQ95TJCe3E1IwEuBa__D6z2"
  },
  {
    "kind": "path",
    "d": "M-233.70798467806267,2521.477359844878 C-322.8991790151663,2521.477359844878 -322.8991790151663,2521.477359844878 -412.0903733522699,2521.477359844878",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__NQ95TJCe3E1IwEuBa__D6y2-A1ZUy16cVRYqmHxoCtUb0z2"
  },
  {
    "kind": "path",
    "d": "M-532.0903733522699,2545.977359844878 C-532.0903733522699,2586.3777947187937 -532.0903733522699,2586.3777947187937 -532.0903733522699,2626.778229592709",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__A1ZUy16cVRYqmHxoCtUb0x2-ap4h4v5Sr4jBH3GwWSH8xw1"
  },
  {
    "kind": "path",
    "d": "M-532.0903733522699,2675.778229592709 C-532.0903733522699,2725.7453934264167 -532.0903733522699,2725.7453934264167 -532.0903733522699,2775.7125572601244",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__ap4h4v5Sr4jBH3GwWSH8xx2-6d8cjWZ4BuUjwT0seiuzJw2"
  },
  {
    "kind": "path",
    "d": "M-114.66572340335313,3018.724470475211 C-114.66572340335313,3044.147515927188 -114.66572340335313,3044.147515927188 -114.66572340335313,3069.570561379165",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__L7AllJfKvClaam3y-u6DPx2-5eUbDdOTOfaOhUlZAmmXWw1"
  },
  {
    "kind": "path",
    "d": "M-233.70798467806267,3275.25758313553 C-321.9388506791955,3275.25758313553 -321.9388506791955,3275.25758313553 -410.1697166803284,3275.25758313553",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__KMA7NkxFbPoUDtFnGBFnjy2-mQHpSyMR4Rra4mqAslgiSz1"
  },
  {
    "kind": "path",
    "d": "M-233.70798467806267,3275.25758313553 C-321.9388506791955,3275.25758313553 -321.9388506791955,3328.25758313553 -410.1697166803284,3328.25758313553",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__KMA7NkxFbPoUDtFnGBFnjy2-GJctl0tVXe4B70s35RkLTz1"
  },
  {
    "kind": "path",
    "d": "M-233.70798467806267,3275.25758313553 C-321.9388506791955,3275.25758313553 -321.9388506791955,3381.25758313553 -410.1697166803284,3381.25758313553",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0.8 8",
    "dataEdgeId": "xy-edge__KMA7NkxFbPoUDtFnGBFnjy2-2MRvAK9G9RGM_auWytcKhz1"
  },
  {
    "kind": "path",
    "d": "M-532.0903733522699,2824.7125572601244 C-532.0903733522699,2897.2185138676678 -532.0903733522699,2897.2185138676678 -532.0903733522699,2969.724470475211",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__6d8cjWZ4BuUjwT0seiuzJx2-ruoFa3M4bUE3Dg6GXSiUIw2"
  },
  {
    "kind": "path",
    "d": "M5.334276596646873,2994.224470475211 C82.41573069429882,2994.224470475211 82.41573069429882,2994.224470475211 159.49718479195076,2994.224470475211",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__L7AllJfKvClaam3y-u6DPz2-e-k6EhoxYG9h0x6vWOrDhy1"
  },
  {
    "kind": "path",
    "d": "M279.49718479195076,3018.724470475211 C279.49718479195076,3068.0360280925224 279.49718479195076,3068.0360280925224 279.49718479195076,3117.347585709834",
    "stroke": "#2b78e4",
    "strokeWidth": "3.5",
    "strokeDasharray": "0",
    "dataEdgeId": "xy-edge__e-k6EhoxYG9h0x6vWOrDhx2-PoM77O2OtxPELxfrW1wtlw2"
  },
  {
    "kind": "g",
    "dataNodeId": "rTPILeOl4kayCrrRkV9QA",
    "dataType": "vertical",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "-114.66572340335313",
        "y1": "3294.6015325696467",
        "x2": "-114.66572340335313",
        "y2": "3463.6015325696467",
        "style": "stroke-linecap: round; stroke-width: 3.5; stroke: #2B78E4; stroke-dasharray: 0.8 8;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "rmlzKAqMMvFBRvbJB6ume",
    "dataType": "vertical",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "-468.3814218617622",
        "y1": "2431.396572653209",
        "x2": "-468.3814218617622",
        "y2": "2536.396572653209",
        "style": "stroke-linecap: round; stroke-width: 3.5; stroke: #2B78E4; stroke-dasharray: 0.8 8;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "eD2bXXZSLfizqzt7lEWrd",
    "dataType": "vertical",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "-593.0903733522699",
        "y1": "2409.547638966104",
        "x2": "-593.0903733522699",
        "y2": "2498.547638966104",
        "style": "stroke-linecap: round; stroke-width: 3.5; stroke: #2B78E4; stroke-dasharray: 0.8 8;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "TNtfSIljEHYwIDsyhbvt1",
    "dataType": "section",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-303.9232599307553",
        "y": "2370.345472761637",
        "width": "179.3",
        "height": "91.3",
        "rx": "5",
        "fill": "transparent",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-305.27325993075533",
        "y": "2360.9954727616373",
        "textAnchor": "left",
        "dominantBaseline": "auto",
        "fontSize": "14",
        "fill": "black",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": ""
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "UlCAHtW9pG4UEzZDncztz",
    "dataType": "section",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-303.9232599307553",
        "y": "2241.790441305402",
        "width": "179.3",
        "height": "111.3",
        "rx": "5",
        "fill": "#ffffff",
        "stroke": "#000000",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-305.27325993075533",
        "y": "2232.440441305402",
        "textAnchor": "left",
        "dominantBaseline": "auto",
        "fontSize": "14",
        "fill": "black",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": ""
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "a8oOlkyM_C8vHuHqeiOAK",
    "dataType": "section",
    "dataTitle": null,
    "dataParentId": "Cxspmb14_0i1tfw-ZLxEu",
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-114.37194919784626",
        "y": "2185.9425725151477",
        "width": "194.3",
        "height": "275.3",
        "rx": "5",
        "fill": "#ffffff",
        "stroke": "#000000",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-115.72194919784626",
        "y": "2176.592572515148",
        "textAnchor": "left",
        "dominantBaseline": "auto",
        "fontSize": "14",
        "fill": "black",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": ""
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "Ag-cO_gijx-4zjVev-ip_",
    "dataType": "horizontal",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "-483.77242250189596",
        "y1": "1877.2118525728308",
        "x2": "-75.77242250189596",
        "y2": "1877.2118525728308",
        "style": "stroke-linecap: round; stroke-width: 3.65; stroke: #2B78E4; stroke-dasharray: 0;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "cpXONhDqKFe4qD5TAv7Ie",
    "dataType": "horizontal",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "-397.9565506483883",
        "y1": "763.564831207322",
        "x2": "-236.95655064838832",
        "y2": "763.564831207322",
        "style": "stroke-linecap: round; stroke-width: 3.5; stroke: #2B78E4; stroke-dasharray: 0.8 8;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "w2THS-JTQ48uYd23lqKCh",
    "dataType": "horizontal",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "-41.689212167555525",
        "y1": "572.2248298360628",
        "x2": "172.31078783244448",
        "y2": "572.2248298360628",
        "style": "stroke-linecap: round; stroke-width: 3.65; stroke: #2B78E4; stroke-dasharray: 0;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "tDo-Q_H0Jor2fUSKhrDCd",
    "dataType": "vertical",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "343.4937966230152",
        "y1": "377.49093274179154",
        "x2": "343.4937966230152",
        "y2": "462.49093274179154",
        "style": "stroke-linecap: round; stroke-width: 3.5; stroke: #2B78E4; stroke-dasharray: 0.8 8;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "wn2dsBrli3cswlXF4SltS",
    "dataType": "vertical",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "220.88511597039758",
        "y1": "375.49093274179154",
        "x2": "220.88511597039758",
        "y2": "463.49093274179154",
        "style": "stroke-linecap: round; stroke-width: 3.5; stroke: #2B78E4; stroke-dasharray: 0.8 8;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "0vLaVNJaJSHZ_bHli6Qzs",
    "dataType": "paragraph",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-516.2564178431196",
        "y": "3463.6558236930396",
        "width": "571",
        "height": "112.5",
        "rx": "5",
        "fill": "WHITe",
        "stroke": "#000000",
        "strokeWidth": "2.5",
        "style": null
      },
      {
        "tag": "text",
        "x": null,
        "y": null,
        "textAnchor": null,
        "dominantBaseline": null,
        "fontSize": null,
        "fill": "black",
        "text": "",
        "tspans": [
          {
            "x": "-232.0064178431196",
            "y": "3492.4058236930396",
            "dy": "0",
            "textAnchor": "middle",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "Continue Learning with following relevant tracks"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "jJebnKe4JftMXZ1lCsipq",
    "dataType": "title",
    "dataTitle": "Front-end",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "-66.59925177765109",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "28",
        "fill": "black",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Front-end"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "VlNNwIEDWqQXtqkHWJYzC",
    "dataType": "topic",
    "dataTitle": "Internet",
    "dataParentId": "jJebnKe4JftMXZ1lCsipq",
    "dataParentTitle": "Front-end",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "69.62030742190214",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "94.92030742190215",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Internet"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "yCnn-NfSxIybUQ2iTuUGq",
    "dataType": "subtopic",
    "dataTitle": "How does the internet work?",
    "dataParentId": "VlNNwIEDWqQXtqkHWJYzC",
    "dataParentTitle": "Internet",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "87.59102681162429",
        "y": "-93.37969257809786",
        "width": "305.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "240.2410268116243",
        "y": "-68.07969257809785",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "How does the internet work?"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "R12sArWVpbIs_PHxBqVaR",
    "dataType": "subtopic",
    "dataTitle": "What is HTTP?",
    "dataParentId": "VlNNwIEDWqQXtqkHWJYzC",
    "dataParentTitle": "Internet",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "87.59102681162429",
        "y": "-39.37969257809785",
        "width": "305.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "240.2410268116243",
        "y": "-14.079692578097854",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "What is HTTP?"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ZhSuu2VArnzPDp6dPQQSC",
    "dataType": "subtopic",
    "dataTitle": "What is Domain Name?",
    "dataParentId": "VlNNwIEDWqQXtqkHWJYzC",
    "dataParentTitle": "Internet",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "87.59102681162429",
        "y": "14.620307421902146",
        "width": "305.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "240.2410268116243",
        "y": "39.920307421902145",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "What is Domain Name?"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "aqMaEY8gkKMikiqleV5EP",
    "dataType": "subtopic",
    "dataTitle": "What is hosting?",
    "dataParentId": "VlNNwIEDWqQXtqkHWJYzC",
    "dataParentTitle": "Internet",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "87.59102681162429",
        "y": "68.62030742190214",
        "width": "305.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "240.2410268116243",
        "y": "93.92030742190215",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "What is hosting?"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "hkxw9jPGYphmjhTjw8766",
    "dataType": "subtopic",
    "dataTitle": "DNS and how it works?",
    "dataParentId": "VlNNwIEDWqQXtqkHWJYzC",
    "dataParentTitle": "Internet",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "87.59102681162429",
        "y": "122.62030742190214",
        "width": "305.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "240.2410268116243",
        "y": "147.92030742190215",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "DNS and how it works?"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "P82WFaTPgQEPNp5IIuZ1Y",
    "dataType": "subtopic",
    "dataTitle": "Browsers and how they work?",
    "dataParentId": "VlNNwIEDWqQXtqkHWJYzC",
    "dataParentTitle": "Internet",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "87.59102681162429",
        "y": "176.62030742190214",
        "width": "305.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "240.2410268116243",
        "y": "201.92030742190215",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Browsers and how they work?"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "yWG2VUkaF5IJVVut6AiSy",
    "dataType": "topic",
    "dataTitle": "HTML",
    "dataParentId": "VlNNwIEDWqQXtqkHWJYzC",
    "dataParentTitle": "Internet",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "179.62030742190214",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "204.92030742190215",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "HTML"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ZhJhf1M2OphYbEmduFq-9",
    "dataType": "topic",
    "dataTitle": "CSS",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "232.62030742190214",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "257.9203074219021",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "CSS"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ODcfFEorkfJNupoQygM53",
    "dataType": "topic",
    "dataTitle": "JavaScript",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "285.62030742190217",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "310.9203074219021",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "JavaScript"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "MXnFhZlNB1zTsBFDyni9H",
    "dataType": "topic",
    "dataTitle": "VCS Hosting",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "438.84093274179156",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "464.1409327417915",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "VCS Hosting"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "NIY7c4TQEEHx0hATu-k5C",
    "dataType": "topic",
    "dataTitle": "Version Control ",
    "dataParentId": "ODcfFEorkfJNupoQygM53",
    "dataParentTitle": "JavaScript",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "385.84093274179156",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "411.1409327417915",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Version Control "
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "R_I4SGYqLk5zze5I1zS_E",
    "dataType": "subtopic",
    "dataTitle": "Git",
    "dataParentId": "NIY7c4TQEEHx0hATu-k5C",
    "dataParentTitle": "Version Control ",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-528.7403733522699",
        "y": "385.84093274179156",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-471.0903733522699",
        "y": "411.1409327417915",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Git"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "IqvS1V-98cxko3e9sBQgP",
    "dataType": "topic",
    "dataTitle": "Package Managers",
    "dataParentId": "MXnFhZlNB1zTsBFDyni9H",
    "dataParentTitle": "VCS Hosting",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "163.52959517325755",
        "y": "438.84093274179156",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "282.17959517325755",
        "y": "464.1409327417915",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Package Managers"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "qmTVMJDsEhNIkiwE_UTYu",
    "dataType": "subtopic",
    "dataTitle": "GitHub",
    "dataParentId": "MXnFhZlNB1zTsBFDyni9H",
    "dataParentTitle": "VCS Hosting",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-528.7403733522699",
        "y": "438.84093274179156",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-471.0903733522699",
        "y": "464.1409327417915",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "GitHub"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "zIoSJMX3cuzCgDYHjgbEh",
    "dataType": "subtopic",
    "dataTitle": "GitLab",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "438.84093274179156",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-593.0903733522699",
        "y": "464.1409327417915",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "GitLab"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "yrq3nOwFREzl-9EKnpU-e",
    "dataType": "subtopic",
    "dataTitle": "yarn",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "285.5295951732576",
        "y": "295.0748298360628",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "343.17959517325755",
        "y": "320.37482983606276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "yarn"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "SLxA5qJFp_28TRzr1BjxZ",
    "dataType": "subtopic",
    "dataTitle": "pnpm",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "163.52959517325752",
        "y": "348.0748298360628",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "221.17959517325752",
        "y": "373.37482983606276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "pnpm"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ib_FHinhrw8VuSet-xMF7",
    "dataType": "subtopic",
    "dataTitle": "npm",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "163.52959517325755",
        "y": "295.0748298360628",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "221.17959517325755",
        "y": "320.37482983606276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "npm"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "eXezX7CVNyC1RuyU_I4yP",
    "dataType": "topic",
    "dataTitle": "Learn a Framework",
    "dataParentId": "DI8pvEosrUU7lcaGa7-Kc",
    "dataParentTitle": "At this point, you should be able to build modern vanilla JS frontend applications.",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "740.414831207322",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "765.7148312073219",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Learn a Framework"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "-bHFIiXnoUQSov64WI9yo",
    "dataType": "subtopic",
    "dataTitle": "Angular",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "636.6767930432965",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "661.9767930432964",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Angular"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ERAdwL1G9M1bnx-fOm5ZA",
    "dataType": "subtopic",
    "dataTitle": "Vue.js",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "583.6767930432965",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "608.9767930432964",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Vue.js"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "tG5v3O4lNIFc2uCnacPak",
    "dataType": "subtopic",
    "dataTitle": "React",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "530.6767930432965",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "555.9767930432964",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "React"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ZR-qZ2Lcbu3FtqaMd3wM4",
    "dataType": "subtopic",
    "dataTitle": "Svelte",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "689.6767930432965",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "714.9767930432964",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Svelte"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "DxOSKnqAjZOPP-dq_U7oP",
    "dataType": "subtopic",
    "dataTitle": "Solid JS",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "742.6767930432965",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "767.9767930432964",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Solid JS"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "XDTD8el6OwuQ55wC-X4iV",
    "dataType": "topic",
    "dataTitle": "CSS Frameworks",
    "dataParentId": "IqvS1V-98cxko3e9sBQgP",
    "dataParentTitle": "Package Managers",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "163.52959517325755",
        "y": "549.0748298360628",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "282.17959517325755",
        "y": "574.3748298360628",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "CSS Frameworks"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "eghnfG4p7i-EDWfp3CQXC",
    "dataType": "subtopic",
    "dataTitle": "Tailwind",
    "dataParentId": "XDTD8el6OwuQ55wC-X4iV",
    "dataParentTitle": "CSS Frameworks",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "163.52959517325755",
        "y": "634.6203074219021",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "282.17959517325755",
        "y": "659.9203074219021",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Tailwind"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "LEijbLyxg4RyutKEM2Y5g",
    "dataType": "vertical",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "-117.45655064838832",
        "y1": "-209.5992517776511",
        "x2": "-117.45655064838832",
        "y2": "-100.59925177765109",
        "style": "stroke-linecap: round; stroke-width: 3.5; stroke: #0A33FF; stroke-dasharray: 0.8 8;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "9VcGfDBBD8YcKatj4VcH1",
    "dataType": "topic",
    "dataTitle": "Linters & Formatters",
    "dataParentId": "flwf3QbJioovtOpMw4obo",
    "dataParentTitle": "Advanced Frontend",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195078",
        "y": "1485.9057520139006",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1511.2057520139008",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Linters & Formatters"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "hkSc_1x09m7-7BO7WzlDT",
    "dataType": "topic",
    "dataTitle": "Module Bundlers",
    "dataParentId": "9VcGfDBBD8YcKatj4VcH1",
    "dataParentTitle": "Linters & Formatters",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "1485.9057520139006",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "1511.2057520139008",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Module Bundlers"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "NS-hwaWa5ebSmNNRoxFDp",
    "dataType": "subtopic",
    "dataTitle": "Parcel",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "1740.4466308599274",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "1765.7466308599276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Parcel"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "sCjErk7rfWAUvhl8Kfm3n",
    "dataType": "subtopic",
    "dataTitle": "Rollup",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "1687.4466308599274",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-174.70798467806267",
        "y": "1712.7466308599276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Rollup"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "4W7UXfdKIUsm1bUrjdTVT",
    "dataType": "subtopic",
    "dataTitle": "esbuild",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-110.35798467806268",
        "y": "1634.4466308599274",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-52.70798467806267",
        "y": "1659.7466308599276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "esbuild"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "0Awx3zEI5_gYEIrD7IVX6",
    "dataType": "subtopic",
    "dataTitle": "Vite",
    "dataParentId": "hkSc_1x09m7-7BO7WzlDT",
    "dataParentTitle": "Module Bundlers",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "1581.4466308599274",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "1606.7466308599276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Vite"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "zbkpu_gvQ4mgCiZKzS1xv",
    "dataType": "subtopic",
    "dataTitle": "Prettier",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "1637.9057520139006",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1663.2057520139008",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Prettier"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "NFjsI712_qP0IOmjuqXar",
    "dataType": "subtopic",
    "dataTitle": "ESLint",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "1690.9057520139006",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1716.2057520139008",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "ESLint"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "igg4_hb3XE3vuvY8ufV-4",
    "dataType": "topic",
    "dataTitle": "Testing",
    "dataParentId": "U5mD5FmVx7VWeKxDpQxB5",
    "dataParentTitle": "Auth Strategies",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "1854.0618525728307",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "1879.361852572831",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Testing"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "hVQ89f6G0LXEgHIOKHDYq",
    "dataType": "subtopic",
    "dataTitle": "Vitest",
    "dataParentId": "igg4_hb3XE3vuvY8ufV-4",
    "dataParentTitle": "Testing",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "1939.9378153769437",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "1965.237815376944",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Vitest"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "g5itUjgRXd9vs9ujHezFl",
    "dataType": "subtopic",
    "dataTitle": "Jest",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2098.9378153769435",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "2124.2378153769437",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Jest"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "jramLk8FGuaEH4YpHIyZT",
    "dataType": "subtopic",
    "dataTitle": "Playwright",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "1992.9378153769437",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "2018.237815376944",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Playwright"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "DaynCz5RR26gjT6N6gTDL",
    "dataType": "subtopic",
    "dataTitle": "Cypress",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2045.9378153769437",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "2071.2378153769437",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Cypress"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "U5mD5FmVx7VWeKxDpQxB5",
    "dataType": "topic",
    "dataTitle": "Auth Strategies",
    "dataParentId": "hkSc_1x09m7-7BO7WzlDT",
    "dataParentTitle": "Module Bundlers",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "1485.9057520139006",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "1511.2057520139008",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Auth Strategies"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "RDWbG3Iui6IPgp0shvXtg",
    "dataType": "topic",
    "dataTitle": "Web Security",
    "dataParentId": "3HgiMfqihjWceSxd6ei8s",
    "dataParentTitle": "Web APIs",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "2078.464686047012",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "2103.764686047012",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Web Security"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "AfH2zCbqzw0Nisg1yyISS",
    "dataType": "subtopic",
    "dataTitle": "CORS",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "1803.081167038745",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1828.3811670387452",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "CORS"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "uum7vOhOUR38vLuGZy8Oa",
    "dataType": "subtopic",
    "dataTitle": "HTTPS",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "1856.081167038745",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1881.3811670387452",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "HTTPS"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "rmcm0CZbtNVC9LZ14-H6h",
    "dataType": "subtopic",
    "dataTitle": "CSP",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "1909.081167038745",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1934.3811670387452",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "CSP"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "JanR7I_lNnUCXhCMGLdn-",
    "dataType": "subtopic",
    "dataTitle": "OWASP Risks",
    "dataParentId": "RDWbG3Iui6IPgp0shvXtg",
    "dataParentTitle": "Web Security",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "1962.081167038745",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1987.3811670387452",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "OWASP Risks"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ruoFa3M4bUE3Dg6GXSiUI",
    "dataType": "topic",
    "dataTitle": "Web Components",
    "dataParentId": "6d8cjWZ4BuUjwT0seiuzJ",
    "dataParentTitle": "Performance",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2971.074470475211",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "2996.374470475211",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Web Components"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "NQ95TJCe3E1IwEuBa__D6",
    "dataType": "topic",
    "dataTitle": "Type Checkers",
    "dataParentId": "n0q32YhWEIAUwbGXexoqV",
    "dataParentTitle": "SSG",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "2498.3273598448777",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "2523.627359844878",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Type Checkers"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "VxiQPgcYDFAT6WgSRWpIA",
    "dataType": "subtopic",
    "dataTitle": "Custom Elements",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "3126.591237679653",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "3151.8912376796534",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Custom Elements"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "Hk8AVonOd693_y1sykPqd",
    "dataType": "subtopic",
    "dataTitle": "HTML Templates",
    "dataParentId": "ruoFa3M4bUE3Dg6GXSiUI",
    "dataParentTitle": "Web Components",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "3072.591237679653",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "3097.8912376796534",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "HTML Templates"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "-SpsNeOZBkQfDA-rwzgPg",
    "dataType": "subtopic",
    "dataTitle": "Shadow DOM",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "3180.591237679653",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "3205.8912376796534",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Shadow DOM"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "Cxspmb14_0i1tfw-ZLxEu",
    "dataType": "topic",
    "dataTitle": "SSR",
    "dataParentId": "RDWbG3Iui6IPgp0shvXtg",
    "dataParentTitle": "Web Security",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "2300.4425725151477",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "2325.742572515148",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "SSR"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "OL8I6nOZ8hGGWmtxg_Mv8",
    "dataType": "subtopic",
    "dataTitle": "Svelte",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-283.42325993075536",
        "y": "2402.845472761637",
        "width": "138.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-214.2732599307554",
        "y": "2428.1454727616374",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Svelte"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "3TE_iYvbklXK0be-5f2M7",
    "dataType": "topic",
    "dataTitle": "Vue.js",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-303.9232599307553",
        "y": "2217.290441305402",
        "width": "179.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-214.27325993075533",
        "y": "2242.5904413054022",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Vue.js"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "k6rp6Ua9qUEW_DA_fOg5u",
    "dataType": "subtopic",
    "dataTitle": "Angular",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-303.9232599307553",
        "y": "2161.4425725151477",
        "width": "179.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-214.27325993075533",
        "y": "2186.742572515148",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Angular"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "SGDf_rbfmFSHlxI-Czzlz",
    "dataType": "topic",
    "dataTitle": "React",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-114.37194919784626",
        "y": "2161.4425725151477",
        "width": "194.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-17.221949197846257",
        "y": "2186.742572515148",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "React"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "KJRkrFZIihCUBrOf579EU",
    "dataType": "subtopic",
    "dataTitle": "react-router",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-91.37194919784626",
        "y": "2391.338935454003",
        "width": "151.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-15.721949197846257",
        "y": "2416.6389354540033",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "react-router"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "zNFYAJaSq0YZXL5Rpx1NX",
    "dataType": "subtopic",
    "dataTitle": "Next.js",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-91.37194919784626",
        "y": "2232.338935454003",
        "width": "151.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-15.721949197846257",
        "y": "2257.6389354540033",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Next.js"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "BBsXxkbbEG-gnbM1xXKrj",
    "dataType": "subtopic",
    "dataTitle": "Nuxt.js",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-283.42325993075536",
        "y": "2279.290441305402",
        "width": "138.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-214.2732599307554",
        "y": "2304.5904413054022",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Nuxt.js"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "P4st_telfCwKLSAU2WsQP",
    "dataType": "topic",
    "dataTitle": "SvelteKit",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-303.9232599307553",
        "y": "2345.845472761637",
        "width": "179.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-214.27325993075533",
        "y": "2371.1454727616374",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "SvelteKit"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "L7AllJfKvClaam3y-u6DP",
    "dataType": "topic",
    "dataTitle": "GraphQL",
    "dataParentId": "ruoFa3M4bUE3Dg6GXSiUI",
    "dataParentTitle": "Web Components",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-233.31572340335313",
        "y": "2971.074470475211",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-114.66572340335313",
        "y": "2996.374470475211",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "GraphQL"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "5eUbDdOTOfaOhUlZAmmXW",
    "dataType": "subtopic",
    "dataTitle": "Apollo",
    "dataParentId": "L7AllJfKvClaam3y-u6DP",
    "dataParentTitle": "GraphQL",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-233.31572340335313",
        "y": "3070.920561379165",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-114.66572340335313",
        "y": "3096.2205613791652",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Apollo"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "0moPO23ol33WsjVXSpTGf",
    "dataType": "subtopic",
    "dataTitle": "Relay Modern",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-233.31572340335313",
        "y": "3123.920561379165",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-114.66572340335313",
        "y": "3149.2205613791652",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Relay Modern"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "n0q32YhWEIAUwbGXexoqV",
    "dataType": "topic",
    "dataTitle": "SSG",
    "dataParentId": "Cxspmb14_0i1tfw-ZLxEu",
    "dataParentTitle": "SSR",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "2498.3273598448777",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "2523.627359844878",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "SSG"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "CMrss8E2W0eA6DVEqtPjT",
    "dataType": "subtopic",
    "dataTitle": "Vuepress",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "2717.128229592709",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "2742.428229592709",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Vuepress"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "XWJxV42Dpu2D3xDK10Pn3",
    "dataType": "subtopic",
    "dataTitle": "Nuxt.js",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "2823.128229592709",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "2848.428229592709",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Nuxt.js"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "iUxXq7beg55y76dkwhM13",
    "dataType": "subtopic",
    "dataTitle": "Astro",
    "dataParentId": "n0q32YhWEIAUwbGXexoqV",
    "dataParentTitle": "SSG",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "2611.128229592709",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "2636.428229592709",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Astro"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "io0RHJWIcVxDhcYkV9d38",
    "dataType": "subtopic",
    "dataTitle": "Eleventy",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "2770.128229592709",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "2795.428229592709",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Eleventy"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "V70884VcuXkfrfHyLGtUg",
    "dataType": "subtopic",
    "dataTitle": "Next.js",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "2664.128229592709",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "2689.428229592709",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Next.js"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "PoM77O2OtxPELxfrW1wtl",
    "dataType": "topic",
    "dataTitle": "PWAs",
    "dataParentId": "e-k6EhoxYG9h0x6vWOrDh",
    "dataParentTitle": "Accessibility",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "3118.697585709834",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "3143.9975857098343",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "PWAs"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "VOGKiG2EZVfCBAaa7Df0W",
    "dataType": "topic",
    "dataTitle": "Mobile Apps",
    "dataParentId": "PoM77O2OtxPELxfrW1wtl",
    "dataParentTitle": "PWAs",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "3252.1075831355297",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "3277.40758313553",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Mobile Apps"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "dsTegXTyupjS8iU6I7Xiv",
    "dataType": "subtopic",
    "dataTitle": "React Native",
    "dataParentId": "VOGKiG2EZVfCBAaa7Df0W",
    "dataParentTitle": "Mobile Apps",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "3346.4515325696466",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "3371.7515325696468",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "React Native"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "dIQXjFEUAJAGxxfAYceHU",
    "dataType": "subtopic",
    "dataTitle": "Flutter",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "3399.4515325696466",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "3424.7515325696468",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Flutter"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "Pxyk3nBlWbgmMjsA93E70",
    "dataType": "subtopic",
    "dataTitle": "Ionic",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "3452.4515325696466",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "3477.7515325696468",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Ionic"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "KMA7NkxFbPoUDtFnGBFnj",
    "dataType": "topic",
    "dataTitle": "Desktop Apps",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "3252.1075831355297",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "3277.40758313553",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Desktop Apps"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "qXKNK_IsGS8-JgLK-Q9oU",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/nodejs",
    "children": [
      {
        "tag": "rect",
        "x": "-503.39001036972843",
        "y": "3512.3072291507638",
        "width": "117.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#4136D6",
        "stroke": "#4136D6",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-444.74001036972845",
        "y": "3537.607229150764",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#FFFFFf",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Nodejs"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "RLtk1C3gofHnLJ17x3o5b",
    "dataType": "vertical",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "-126.20798467806267",
        "y1": "3577.4058236930396",
        "x2": "-126.20798467806267",
        "y2": "3662.4058236930396",
        "style": "stroke-linecap: round; stroke-width: 3.5; stroke: #2B78E4; stroke-dasharray: 0.8 8;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "mQHpSyMR4Rra4mqAslgiS",
    "dataType": "subtopic",
    "dataTitle": "Electron",
    "dataParentId": "KMA7NkxFbPoUDtFnGBFnj",
    "dataParentTitle": "Desktop Apps",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-648.8197166803284",
        "y": "3252.1075831355297",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-530.1697166803284",
        "y": "3277.40758313553",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Electron"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "GJctl0tVXe4B70s35RkLT",
    "dataType": "subtopic",
    "dataTitle": "Tauri",
    "dataParentId": "KMA7NkxFbPoUDtFnGBFnj",
    "dataParentTitle": "Desktop Apps",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-648.8197166803284",
        "y": "3305.1075831355297",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-530.1697166803284",
        "y": "3330.40758313553",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Tauri"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "2MRvAK9G9RGM_auWytcKh",
    "dataType": "subtopic",
    "dataTitle": "Flutter",
    "dataParentId": "KMA7NkxFbPoUDtFnGBFnj",
    "dataParentTitle": "Desktop Apps",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-648.8197166803284",
        "y": "3358.1075831355297",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-530.1697166803284",
        "y": "3383.40758313553",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Flutter"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "h26uS3muFCabe6ekElZcI",
    "dataType": "subtopic",
    "dataTitle": "SWC",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "1634.4466308599274",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-174.70798467806267",
        "y": "1659.7466308599276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "SWC"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "qN-6iiXWgn5qSzK3o0Tjo",
    "dataType": "legend",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-653.5314218617622",
        "y": "-290.7454122270983",
        "width": "370.3",
        "height": "122.3",
        "rx": "5",
        "fill": "white",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "g",
        "dataNodeId": "NJhQIvMyMD1Cu-JA1UCmJ",
        "dataType": "legend-item",
        "dataParentId": "qN-6iiXWgn5qSzK3o0Tjo",
        "children": [
          {
            "tag": "circle",
            "cx": "-619.3814218617622",
            "cy": "-263.59541222709834",
            "r": "9.5",
            "fill": "#874efe"
          },
          {
            "tag": "path",
            "d": "M-623.3814218617622 -263.59541222709834L-620.8814218617622 -260.59541222709834 -615.8814218617622 -265.59541222709834",
            "fill": "none",
            "stroke": "#fff",
            "strokeWidth": "2"
          },
          {
            "tag": "text",
            "x": "-601.8814218617622",
            "y": "-261.09541222709834",
            "fontSize": "16",
            "fill": "black",
            "text": "Personal Recommendation"
          }
        ]
      },
      {
        "tag": "g",
        "dataNodeId": "DMx7rAjVBWMbzjSde-tvp",
        "dataType": "legend-item",
        "dataParentId": "qN-6iiXWgn5qSzK3o0Tjo",
        "children": [
          {
            "tag": "circle",
            "cx": "-619.3814218617622",
            "cy": "-231.59541222709834",
            "r": "9.5",
            "fill": "#4f7a28"
          },
          {
            "tag": "path",
            "d": "M-623.3814218617622 -231.59541222709834L-620.8814218617622 -228.59541222709834 -615.8814218617622 -233.59541222709834",
            "fill": "none",
            "stroke": "#fff",
            "strokeWidth": "2"
          },
          {
            "tag": "text",
            "x": "-601.8814218617622",
            "y": "-229.09541222709834",
            "fontSize": "16",
            "fill": "black",
            "text": "Alternative Option"
          }
        ]
      },
      {
        "tag": "g",
        "dataNodeId": "R9WLhURhPdVNXP7AUTDvR",
        "dataType": "legend-item",
        "dataParentId": "qN-6iiXWgn5qSzK3o0Tjo",
        "children": [
          {
            "tag": "circle",
            "cx": "-619.3814218617622",
            "cy": "-199.59541222709834",
            "r": "9.5",
            "fill": "#929292"
          },
          {
            "tag": "path",
            "d": "M-623.3814218617622 -199.59541222709834L-620.8814218617622 -196.59541222709834 -615.8814218617622 -201.59541222709834",
            "fill": "none",
            "stroke": "#fff",
            "strokeWidth": "2"
          },
          {
            "tag": "text",
            "x": "-601.8814218617622",
            "y": "-197.09541222709834",
            "fontSize": "16",
            "fill": "black",
            "text": "Order not strict on roadmap"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "wA2fSYsbBYU02VJXAvUz8",
    "dataType": "subtopic",
    "dataTitle": "Astro",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-91.37194919784626",
        "y": "2338.338935454003",
        "width": "151.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-15.721949197846257",
        "y": "2363.6389354540033",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Astro"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "slf6jmim4p9ti6ZRHOZe_",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/full-stack",
    "children": [
      {
        "tag": "rect",
        "x": "-379.3900103697285",
        "y": "3512.3072291507638",
        "width": "117.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#4136D6",
        "stroke": "#4136D6",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-320.7400103697285",
        "y": "3537.607229150764",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#FFFFFf",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Fullstack"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "MfErpYwkJ0wiWJZEUVfrb",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "/frontend?r=frontend-beginner",
    "children": [
      {
        "tag": "rect",
        "x": "-653.5314218617622",
        "y": "-152.37969257809786",
        "width": "370.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#232323",
        "stroke": "#232323",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-468.3814218617622",
        "y": "-127.07969257809785",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#ffffff",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Visit Beginner Friendly Version"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "LdhFo8UrT6EBs6IE42uLx",
    "dataType": "linksgroup",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-653.5314218617622",
        "y": "-90.37969257809786",
        "width": "370.3",
        "height": "193.3",
        "rx": "5",
        "fill": "white",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-630.8814218617622",
        "y": "-62.729692578097854",
        "textAnchor": "left",
        "dominantBaseline": "middle",
        "fontSize": "16",
        "fill": "black",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Related Roadmaps"
          }
        ]
      },
      {
        "tag": "g",
        "dataNodeId": "qH0LPtPGcn4Lc1RhXwKVp",
        "dataType": "link-item",
        "dataParentId": "LdhFo8UrT6EBs6IE42uLx",
        "children": [
          {
            "tag": "circle",
            "cx": "-622.3814218617622",
            "cy": "-24.229692578097854",
            "r": "9.5",
            "fill": "#6b7280"
          },
          {
            "tag": "path",
            "d": "M-626.3814218617622 -24.229692578097854L-623.8814218617622 -21.229692578097854 -618.8814218617622 -26.229692578097854",
            "fill": "none",
            "stroke": "#fff",
            "strokeWidth": "2"
          },
          {
            "tag": "text",
            "x": "-604.8814218617622",
            "y": "-22.729692578097854",
            "fontSize": "16",
            "fill": "black",
            "text": "JavaScript Roadmap"
          }
        ]
      },
      {
        "tag": "g",
        "dataNodeId": "NHvKDG4LZt_wRREFYubCd",
        "dataType": "link-item",
        "dataParentId": "LdhFo8UrT6EBs6IE42uLx",
        "children": [
          {
            "tag": "circle",
            "cx": "-622.3814218617622",
            "cy": "5.770307421902146",
            "r": "9.5",
            "fill": "#6b7280"
          },
          {
            "tag": "path",
            "d": "M-626.3814218617622 5.770307421902146L-623.8814218617622 8.770307421902146 -618.8814218617622 3.770307421902146",
            "fill": "none",
            "stroke": "#fff",
            "strokeWidth": "2"
          },
          {
            "tag": "text",
            "x": "-604.8814218617622",
            "y": "7.270307421902146",
            "fontSize": "16",
            "fill": "black",
            "text": "React Roadmap"
          }
        ]
      },
      {
        "tag": "g",
        "dataNodeId": "lYZdNGa-RbSvjTZyyfsHK",
        "dataType": "link-item",
        "dataParentId": "LdhFo8UrT6EBs6IE42uLx",
        "children": [
          {
            "tag": "circle",
            "cx": "-622.3814218617622",
            "cy": "35.770307421902146",
            "r": "9.5",
            "fill": "#6b7280"
          },
          {
            "tag": "path",
            "d": "M-626.3814218617622 35.770307421902146L-623.8814218617622 38.770307421902146 -618.8814218617622 33.770307421902146",
            "fill": "none",
            "stroke": "#fff",
            "strokeWidth": "2"
          },
          {
            "tag": "text",
            "x": "-604.8814218617622",
            "y": "37.270307421902146",
            "fontSize": "16",
            "fill": "black",
            "text": "TypeScript Roadmap"
          }
        ]
      },
      {
        "tag": "g",
        "dataNodeId": "-rJot3Dyu48vRQdfpz7HS",
        "dataType": "link-item",
        "dataParentId": "LdhFo8UrT6EBs6IE42uLx",
        "children": [
          {
            "tag": "circle",
            "cx": "-622.3814218617622",
            "cy": "65.77030742190215",
            "r": "9.5",
            "fill": "#6b7280"
          },
          {
            "tag": "path",
            "d": "M-626.3814218617622 65.77030742190215L-623.8814218617622 68.77030742190215 -618.8814218617622 63.770307421902146",
            "fill": "none",
            "stroke": "#fff",
            "strokeWidth": "2"
          },
          {
            "tag": "text",
            "x": "-604.8814218617622",
            "y": "67.27030742190215",
            "fontSize": "16",
            "fill": "black",
            "text": "Node.js Roadmap"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "yObLj-GcXY9bv2isJPCjs",
    "dataType": "paragraph",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-647.1918542150819",
        "y": "171.52030742190215",
        "width": "364",
        "height": "173.5",
        "rx": "5",
        "fill": "#ffffff",
        "stroke": "#ffffff",
        "strokeWidth": "2.5",
        "style": null
      },
      {
        "tag": "text",
        "x": null,
        "y": null,
        "textAnchor": null,
        "dominantBaseline": null,
        "fontSize": null,
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": "-629.9418542150819",
            "y": "200.27030742190215",
            "dy": "0",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "HTML, CSS and JavaScript are the"
          },
          {
            "x": "-629.9418542150819",
            "y": "200.27030742190215",
            "dy": "25.5",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "backbone of web development. Make sure"
          },
          {
            "x": "-629.9418542150819",
            "y": "200.27030742190215",
            "dy": "51",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "to practice by building lots of projects."
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "w4AronIkLVW4DiB8BB_cE",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/frontend/projects?difficulty=beginner",
    "children": [
      {
        "tag": "rect",
        "x": "-630.5918542150819",
        "y": "281.62030742190217",
        "width": "328.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#dedede",
        "stroke": "#DEDEDE",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-466.4418542150819",
        "y": "306.9203074219021",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Beginner Project Ideas"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "j2H1qGosbveayviOCVkUs",
    "dataType": "subtopic",
    "dataTitle": "Bun",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "285.5295951732576",
        "y": "348.0748298360628",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "343.17959517325755",
        "y": "373.37482983606276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Bun"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "DI8pvEosrUU7lcaGa7-Kc",
    "dataType": "paragraph",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-294.2065506483883",
        "y": "516.5203074219021",
        "width": "357",
        "height": "148.5",
        "rx": "5",
        "fill": "#ffffff",
        "stroke": "#ffffff",
        "strokeWidth": "2.5",
        "style": null
      },
      {
        "tag": "text",
        "x": null,
        "y": null,
        "textAnchor": null,
        "dominantBaseline": null,
        "fontSize": null,
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": "-276.9565506483883",
            "y": "545.2703074219021",
            "dy": "0",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "At this point, you should be able to build"
          },
          {
            "x": "-276.9565506483883",
            "y": "545.2703074219021",
            "dy": "25.5",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "modern vanilla JS frontend applications."
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "cSn0Mp45AKmj-bn-b-j_I",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/frontend/projects?difficulty=intermediate",
    "children": [
      {
        "tag": "rect",
        "x": "-276.1065506483883",
        "y": "598.6203074219021",
        "width": "318.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#DEDEDE",
        "stroke": "#DEDEDE",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "623.9203074219021",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Intermediate Project Ideas"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "UvCVChB6NZ_yUg0RdIJ2o",
    "dataType": "subtopic",
    "dataTitle": "Biome",
    "dataParentId": "9VcGfDBBD8YcKatj4VcH1",
    "dataParentTitle": "Linters & Formatters",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195072",
        "y": "1584.9057520139006",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1610.2057520139008",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Biome"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "hE-DbpBpYrfB8tmBEjTnG",
    "dataType": "subtopic",
    "dataTitle": "Rolldown",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-110.35798467806268",
        "y": "1687.4466308599274",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-52.70798467806267",
        "y": "1712.7466308599276",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Rolldown"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "jgyCo2WH4TJjETAa57N1U",
    "dataType": "vertical",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "line",
        "x1": "-400.439276792078",
        "y1": "531.2703074219021",
        "x2": "-400.439276792078",
        "y2": "788.2703074219021",
        "style": "stroke-linecap: round; stroke-width: 3.65; stroke: #2B78E4; stroke-dasharray: 0;"
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ydZRVWQrJUl3LZfjhR8QT",
    "dataType": "paragraph",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-331.2065506483883",
        "y": "1832.2269147243353",
        "width": "431",
        "height": "180.5",
        "rx": "5",
        "fill": "#ffffff",
        "stroke": "#ffffff",
        "strokeWidth": "2.5",
        "style": null
      },
      {
        "tag": "text",
        "x": null,
        "y": null,
        "textAnchor": null,
        "dominantBaseline": null,
        "fontSize": null,
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": "-313.9565506483883",
            "y": "1860.9769147243353",
            "dy": "0",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "At this point you should have the expertise of an"
          },
          {
            "x": "-313.9565506483883",
            "y": "1860.9769147243353",
            "dy": "25.5",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "intermediate level frontend developer. Keep"
          },
          {
            "x": "-313.9565506483883",
            "y": "1860.9769147243353",
            "dy": "51",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "practicing and sharpening your skills."
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "YFhTAvoRXc8aIa9FVZgtb",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/frontend/projects?difficulty=advanced",
    "children": [
      {
        "tag": "rect",
        "x": "-313.1065506483883",
        "y": "1944.0826143468123",
        "width": "392.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#DEDEDE",
        "stroke": "#DEDEDE",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "1969.3826143468125",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Advanced Project Ideas"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "f9zlP6lGhfe6HBHVYiySu",
    "dataType": "subtopic",
    "dataTitle": "Tanstack Start",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-91.37194919784626",
        "y": "2285.338935454003",
        "width": "151.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-15.721949197846257",
        "y": "2310.6389354540033",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Tanstack Start"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "A1ZUy16cVRYqmHxoCtUb0",
    "dataType": "topic",
    "dataTitle": "Deployment",
    "dataParentId": "NQ95TJCe3E1IwEuBa__D6",
    "dataParentTitle": "Type Checkers",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2498.3273598448777",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "2523.627359844878",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Deployment"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "vpzh9bNXCxgdDFQLsot2_",
    "dataType": "subtopic",
    "dataTitle": "GitHub Pages",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2224.746572653209",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "2250.0465726532093",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "GitHub Pages"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "kPJ0jZo5AbOzvZgv0zwp0",
    "dataType": "subtopic",
    "dataTitle": "Vercel",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2277.746572653209",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-593.0903733522699",
        "y": "2303.0465726532093",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Vercel"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "_Uh-UFNe2wP2TV0x2lKY_",
    "dataType": "subtopic",
    "dataTitle": "Cloudflare",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2330.746572653209",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "2356.0465726532093",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Cloudflare"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "o8GstE5gxcGByh-D7lwqT",
    "dataType": "subtopic",
    "dataTitle": "Netlify",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-528.7403733522699",
        "y": "2277.746572653209",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-471.0903733522699",
        "y": "2303.0465726532093",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Netlify"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "PJRsqg5Vx9gQTodxaeZfz",
    "dataType": "subtopic",
    "dataTitle": "Railway",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2383.746572653209",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-593.0903733522699",
        "y": "2409.0465726532093",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Railway"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "wfGz8pshGQARZ7qStGoSD",
    "dataType": "subtopic",
    "dataTitle": "Render",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-528.7403733522699",
        "y": "2383.746572653209",
        "width": "115.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-471.0903733522699",
        "y": "2409.0465726532093",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Render"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "6d8cjWZ4BuUjwT0seiuzJ",
    "dataType": "topic",
    "dataTitle": "Performance",
    "dataParentId": "ap4h4v5Sr4jBH3GwWSH8x",
    "dataParentTitle": "Design Systems",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2777.0625572601243",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "2802.3625572601245",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Performance"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "dz7_QXoO7X0WmS5xuAhhJ",
    "dataType": "subtopic",
    "dataTitle": "Lighthouse",
    "dataParentId": "6d8cjWZ4BuUjwT0seiuzJ",
    "dataParentTitle": "Performance",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "2673.0625572601243",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "2698.3625572601245",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Lighthouse"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "JWU9jc12_ewaIKt3qWLcp",
    "dataType": "subtopic",
    "dataTitle": "DevTools Usage",
    "dataParentId": "6d8cjWZ4BuUjwT0seiuzJ",
    "dataParentTitle": "Performance",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "2726.0625572601243",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "2751.3625572601245",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "DevTools Usage"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "66ya3WdtlkjQyBTc3Lein",
    "dataType": "subtopic",
    "dataTitle": "Service Workers",
    "dataParentId": "6d8cjWZ4BuUjwT0seiuzJ",
    "dataParentTitle": "Performance",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "2779.0625572601243",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "2804.3625572601245",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Service Workers"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "FyNXhHq1VIASNq-LI7JIu",
    "dataType": "subtopic",
    "dataTitle": "Streamed Responses",
    "dataParentId": "6d8cjWZ4BuUjwT0seiuzJ",
    "dataParentTitle": "Performance",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "2885.0625572601243",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "2910.3625572601245",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Streamed Responses"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ap4h4v5Sr4jBH3GwWSH8x",
    "dataType": "topic",
    "dataTitle": "Design Systems",
    "dataParentId": "A1ZUy16cVRYqmHxoCtUb0",
    "dataParentTitle": "Deployment",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "2628.128229592709",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "2653.428229592709",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Design Systems"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "3HgiMfqihjWceSxd6ei8s",
    "dataType": "topic",
    "dataTitle": "Web APIs",
    "dataParentId": "ydZRVWQrJUl3LZfjhR8QT",
    "dataParentTitle": "At this point you should have the expertise of an intermediate level frontend developer. Keep practicing and sharpening your skills.",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "2078.464686047012",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "2103.764686047012",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Web APIs"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "e-k6EhoxYG9h0x6vWOrDh",
    "dataType": "topic",
    "dataTitle": "Accessibility",
    "dataParentId": "L7AllJfKvClaam3y-u6DP",
    "dataParentTitle": "GraphQL",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "2971.074470475211",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "2996.374470475211",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Accessibility"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "Df3nTlTvSQkMGzpufRo9q",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/backend",
    "children": [
      {
        "tag": "rect",
        "x": "-255.3900103697284",
        "y": "3512.3072291507638",
        "width": "117.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#4136D6",
        "stroke": "#4136D6",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-196.7400103697284",
        "y": "3537.607229150764",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#FFFFFf",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Backend"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "-sFboM4eFUMVq1tlPl-fV",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/design-system",
    "children": [
      {
        "tag": "rect",
        "x": "-131.39001036972843",
        "y": "3512.3072291507638",
        "width": "168.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#4136D6",
        "stroke": "#4136D6",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-47.240010369728424",
        "y": "3537.607229150764",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#FFFFFf",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Design System"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "6kWlgayUZQnr9z88fUOkk",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/typescript",
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "2591.128229592709",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#2a79e4",
        "stroke": "#2a79e4",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "2616.428229592709",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#ffffff",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "TypeScript"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "tWDmeXItfQDxB8Jij_V4L",
    "dataType": "subtopic",
    "dataTitle": "Cache-Control",
    "dataParentId": "6d8cjWZ4BuUjwT0seiuzJ",
    "dataParentTitle": "Performance",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-232.35798467806268",
        "y": "2832.0625572601243",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-113.70798467806267",
        "y": "2857.3625572601245",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Cache-Control"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "yHmHXymPNWwu8p1vvqD3o",
    "dataType": "paragraph",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "45.74718479195076",
        "y": "-284.90106699547107",
        "width": "355",
        "height": "140.5",
        "rx": "5",
        "fill": "#FFFFFf",
        "stroke": "#ffffff",
        "strokeWidth": "2.5",
        "style": null
      },
      {
        "tag": "text",
        "x": null,
        "y": null,
        "textAnchor": null,
        "dominantBaseline": null,
        "fontSize": null,
        "fill": "black",
        "text": "",
        "tspans": [
          {
            "x": "62.99718479195076",
            "y": "-256.15106699547107",
            "dy": "0",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "Find the detailed version of this roadmap"
          },
          {
            "x": "62.99718479195076",
            "y": "-256.15106699547107",
            "dy": "25.5",
            "textAnchor": "start",
            "dominantBaseline": "middle",
            "fontSize": "17",
            "fill": null,
            "text": "along with other similar roadmaps"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "2zqZkyVgigifcRS1H7F_b",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh",
    "children": [
      {
        "tag": "rect",
        "x": "59.050559204750904",
        "y": "-202.8155035777258",
        "width": "327.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#e3e3e3",
        "stroke": "#e3e3e3",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "222.7005592047509",
        "y": "-177.51550357772578",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "roadmap.sh"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "RcC1fVuePQZ59AsJfeTdR",
    "dataType": "subtopic",
    "dataTitle": "Claude Code",
    "dataParentId": "ipcNHz8KbfpE57kNP15hP",
    "dataParentTitle": "AI Assisted Coding",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-651.8286501592424",
        "y": "823.7710937030621",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-533.1786501592425",
        "y": "849.071093703062",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Claude Code"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "HQrxxDxKN8gizvXRU5psW",
    "dataType": "subtopic",
    "dataTitle": "Copilot",
    "dataParentId": "ipcNHz8KbfpE57kNP15hP",
    "dataParentTitle": "AI Assisted Coding",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-651.8286501592424",
        "y": "929.7710937030621",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-533.1786501592425",
        "y": "955.071093703062",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Copilot"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "CKlkVK_7GZ7xzIUHJqZr8",
    "dataType": "subtopic",
    "dataTitle": "Cursor",
    "dataParentId": "ipcNHz8KbfpE57kNP15hP",
    "dataParentTitle": "AI Assisted Coding",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-651.8286501592424",
        "y": "876.7710937030621",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-533.1786501592425",
        "y": "902.071093703062",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Cursor"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "E7-LveK7jO2npxVTLUDfw",
    "dataType": "subtopic",
    "dataTitle": "Antigravity",
    "dataParentId": "ipcNHz8KbfpE57kNP15hP",
    "dataParentTitle": "AI Assisted Coding",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-651.8286501592424",
        "y": "982.7710937030621",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-533.1786501592425",
        "y": "1008.071093703062",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Antigravity"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "yKNdBbahm_h81xdMDT-qx",
    "dataType": "subtopic",
    "dataTitle": "How LLMs work",
    "dataParentId": "UTupdqjOyLh7-56_0SXJ8",
    "dataParentTitle": "Learn the Basics",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "962.923788906631",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "988.223788906631",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "How LLMs work"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "IZKl6PxbvgNkryAkdy3-p",
    "dataType": "subtopic",
    "dataTitle": "AI vs Traditional Coding",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "1015.923788906631",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1041.223788906631",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "AI vs Traditional Coding"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "0TMdly8yiqnNR8sx36iqc",
    "dataType": "subtopic",
    "dataTitle": "Code Reviews",
    "dataParentId": "Nx7mjvYgqLpmJ0_iSx5of",
    "dataParentTitle": "Applications",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "1171.1637243924067",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1196.463724392407",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Code Reviews"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "q7NpwqQXUp4wt2to-yFiP",
    "dataType": "subtopic",
    "dataTitle": "Docs Generation",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "1277.1637243924067",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1302.463724392407",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Docs Generation"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "UTupdqjOyLh7-56_0SXJ8",
    "dataType": "topic",
    "dataTitle": "Learn the Basics",
    "dataParentId": "M56-ufyFSwaQYPISuwUcj",
    "dataParentTitle": "AI in Development",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "863.923788906631",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "889.223788906631",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Learn the Basics"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "ipcNHz8KbfpE57kNP15hP",
    "dataType": "topic",
    "dataTitle": "AI Assisted Coding",
    "dataParentId": "eXezX7CVNyC1RuyU_I4yP",
    "dataParentTitle": "Learn a Framework",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "901.6929110844087",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "926.9929110844087",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "AI Assisted Coding"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "Gv_g4gK6pZK6l_0xAn34X",
    "dataType": "topic",
    "dataTitle": "Prompting Techniques",
    "dataParentId": "ipcNHz8KbfpE57kNP15hP",
    "dataParentTitle": "AI Assisted Coding",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "1065.0623796484322",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "1090.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Prompting Techniques"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "Bic4PHhz-YqzPWRimJO83",
    "dataType": "subtopic",
    "dataTitle": "Gemini",
    "dataParentId": "MdYPIf_9ezbIp6Dm5Fyme",
    "dataParentTitle": "Implementing AI",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "1260.0623796484322",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "1285.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Gemini"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "-ye5ZtYFDoYGpj-UJaBP8",
    "dataType": "subtopic",
    "dataTitle": "OpenAI",
    "dataParentId": "MdYPIf_9ezbIp6Dm5Fyme",
    "dataParentTitle": "Implementing AI",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "1313.0623796484322",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "1338.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "OpenAI"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "Lw2nR7x8PYgq1P5CxPAxi",
    "dataType": "subtopic",
    "dataTitle": "Anthropic",
    "dataParentId": "MdYPIf_9ezbIp6Dm5Fyme",
    "dataParentTitle": "Implementing AI",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "1366.0623796484322",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "1391.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Anthropic"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "MdYPIf_9ezbIp6Dm5Fyme",
    "dataType": "topic",
    "dataTitle": "Implementing AI",
    "dataParentId": "xL8d-uHMpJKwUvT8z-Jia",
    "dataParentTitle": "Skills",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "1366.0623796484322",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "1391.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Implementing AI"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "M56-ufyFSwaQYPISuwUcj",
    "dataType": "label",
    "dataTitle": null,
    "dataParentId": "eXezX7CVNyC1RuyU_I4yP",
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "text",
        "x": "198.49718479195076",
        "y": "769.564831207322",
        "textAnchor": "left",
        "dominantBaseline": "auto",
        "fontSize": "20",
        "fill": "black",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "AI in Development"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "EYT2rTLZ8tUW2u8DOnAWF",
    "dataType": "subtopic",
    "dataTitle": "Refactoring",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "1224.1637243924067",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1249.463724392407",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Refactoring"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "Nx7mjvYgqLpmJ0_iSx5of",
    "dataType": "subtopic",
    "dataTitle": "Applications",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "160.84718479195075",
        "y": "1068.9237889066308",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#ffe599",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #f3c950"
      },
      {
        "tag": "text",
        "x": "279.49718479195076",
        "y": "1094.223788906631",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Applications"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "k4hMVVBMatedUq5EKiMo4",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/prompt-engineering",
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "1063.0623796484322",
        "width": "237.3",
        "height": "50.3",
        "rx": "5",
        "fill": "#2a79e4",
        "stroke": "#2a79e4",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "1090.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#ffffff",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Prompt Engineering"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "vpimgXt10UQFBDVHR21IU",
    "dataType": "button",
    "dataTitle": null,
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": "https://roadmap.sh/ai-agents",
    "children": [
      {
        "tag": "rect",
        "x": "-650.7403733522699",
        "y": "1156.0623796484322",
        "width": "237.3",
        "height": "50.3",
        "rx": "5",
        "fill": "#2a79e4",
        "stroke": "#2a79e4",
        "strokeWidth": "2.7",
        "style": null
      },
      {
        "tag": "text",
        "x": "-532.0903733522699",
        "y": "1183.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#ffffff",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "AI Agents Roadmap"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "e4j6u0e_WqK1vfrUwJJ4M",
    "dataType": "topic",
    "dataTitle": "Agents",
    "dataParentId": "Gv_g4gK6pZK6l_0xAn34X",
    "dataParentTitle": "Prompting Techniques",
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "1158.0623796484322",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "1183.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Agents"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "XFy2gj7DmXeaCoc6MZo_j",
    "dataType": "topic",
    "dataTitle": "MCP",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "1211.0623796484322",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "1236.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "MCP"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "xL8d-uHMpJKwUvT8z-Jia",
    "dataType": "topic",
    "dataTitle": "Skills",
    "dataParentId": null,
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "rect",
        "x": "-235.60655064838832",
        "y": "1264.0623796484322",
        "width": "237.3",
        "height": "46.3",
        "rx": "5",
        "fill": "#fdff00",
        "stroke": "black",
        "strokeWidth": "2.7",
        "style": "--hover-color: #d6d700"
      },
      {
        "tag": "text",
        "x": "-116.95655064838832",
        "y": "1289.3623796484324",
        "textAnchor": "middle",
        "dominantBaseline": "middle",
        "fontSize": "17",
        "fill": "#000000",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Skills"
          }
        ]
      }
    ]
  },
  {
    "kind": "g",
    "dataNodeId": "flwf3QbJioovtOpMw4obo",
    "dataType": "label",
    "dataTitle": null,
    "dataParentId": "MdYPIf_9ezbIp6Dm5Fyme",
    "dataParentTitle": null,
    "dataLink": null,
    "children": [
      {
        "tag": "text",
        "x": "192.99718479195076",
        "y": "1395.2123796484323",
        "textAnchor": "left",
        "dominantBaseline": "auto",
        "fontSize": "20",
        "fill": "black",
        "text": "",
        "tspans": [
          {
            "x": null,
            "y": null,
            "dy": null,
            "textAnchor": null,
            "dominantBaseline": null,
            "fontSize": null,
            "fill": null,
            "text": "Advanced Frontend"
          }
        ]
      }
    ]
  },
  {
    "kind": "circle",
    "cx": "393.2410268116243",
    "cy": "-70.72969257809785",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M389.2410268116243 -70.72969257809785L391.7410268116243 -67.72969257809785 396.7410268116243 -72.72969257809785",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "393.2410268116243",
    "cy": "-16.729692578097854",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M389.2410268116243 -16.729692578097854L391.7410268116243 -13.729692578097854 396.7410268116243 -18.729692578097854",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "393.2410268116243",
    "cy": "37.270307421902146",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M389.2410268116243 37.270307421902146L391.7410268116243 40.270307421902146 396.7410268116243 35.270307421902146",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "393.2410268116243",
    "cy": "91.27030742190215",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M389.2410268116243 91.27030742190215L391.7410268116243 94.27030742190215 396.7410268116243 89.27030742190215",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "393.2410268116243",
    "cy": "145.27030742190215",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M389.2410268116243 145.27030742190215L391.7410268116243 148.27030742190215 396.7410268116243 143.27030742190215",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "393.2410268116243",
    "cy": "199.27030742190215",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M389.2410268116243 199.27030742190215L391.7410268116243 202.27030742190215 396.7410268116243 197.27030742190215",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-413.0903733522699",
    "cy": "408.49093274179154",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-417.0903733522699 408.49093274179154L-414.5903733522699 411.49093274179154 -409.5903733522699 406.49093274179154",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-413.0903733522699",
    "cy": "461.49093274179154",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-417.0903733522699 461.49093274179154L-414.5903733522699 464.49093274179154 -409.5903733522699 459.49093274179154",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "461.49093274179154",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 461.49093274179154L-653.0903733522699 464.49093274179154 -648.0903733522699 459.49093274179154",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "401.17959517325755",
    "cy": "317.7248298360628",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M397.17959517325755 317.7248298360628L399.67959517325755 320.7248298360628 404.67959517325755 315.7248298360628",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "162.67959517325752",
    "cy": "370.7248298360628",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M158.67959517325752 370.7248298360628L161.17959517325752 373.7248298360628 166.17959517325752 368.7248298360628",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "162.67959517325755",
    "cy": "317.7248298360628",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M158.67959517325755 317.7248298360628L161.17959517325755 320.7248298360628 166.17959517325755 315.7248298360628",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "659.3267930432964",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 659.3267930432964L-653.0903733522699 662.3267930432964 -648.0903733522699 657.3267930432964",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "606.3267930432964",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 606.3267930432964L-653.0903733522699 609.3267930432964 -648.0903733522699 604.3267930432964",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "553.3267930432964",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 553.3267930432964L-653.0903733522699 556.3267930432964 -648.0903733522699 551.3267930432964",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "712.3267930432964",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 712.3267930432964L-653.0903733522699 715.3267930432964 -648.0903733522699 710.3267930432964",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "765.3267930432964",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 765.3267930432964L-653.0903733522699 768.3267930432964 -648.0903733522699 763.3267930432964",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "162.67959517325755",
    "cy": "657.2703074219021",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M158.67959517325755 657.2703074219021L161.17959517325755 660.2703074219021 166.17959517325755 655.2703074219021",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-233.20798467806267",
    "cy": "1763.0966308599275",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-237.20798467806267 1763.0966308599275L-234.70798467806267 1766.0966308599275 -229.70798467806267 1761.0966308599275",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-233.20798467806267",
    "cy": "1710.0966308599275",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-237.20798467806267 1710.0966308599275L-234.70798467806267 1713.0966308599275 -229.70798467806267 1708.0966308599275",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "5.292015321937328",
    "cy": "1657.0966308599275",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M1.2920153219373276 1657.0966308599275L3.7920153219373276 1660.0966308599275 8.792015321937328 1655.0966308599275",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "5.292015321937328",
    "cy": "1604.0966308599275",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M1.2920153219373276 1604.0966308599275L3.7920153219373276 1607.0966308599275 8.792015321937328 1602.0966308599275",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "398.49718479195076",
    "cy": "1660.5557520139007",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M394.49718479195076 1660.5557520139007L396.99718479195076 1663.5557520139007 401.99718479195076 1658.5557520139007",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "398.49718479195076",
    "cy": "1713.5557520139007",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M394.49718479195076 1713.5557520139007L396.99718479195076 1716.5557520139007 401.99718479195076 1711.5557520139007",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "1962.5878153769438",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 1962.5878153769438L-653.0903733522699 1965.5878153769438 -648.0903733522699 1960.5878153769438",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "2121.5878153769436",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 2121.5878153769436L-653.0903733522699 2124.5878153769436 -648.0903733522699 2119.5878153769436",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "2015.5878153769438",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 2015.5878153769438L-653.0903733522699 2018.5878153769438 -648.0903733522699 2013.5878153769438",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "2068.5878153769436",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 2068.5878153769436L-653.0903733522699 2071.5878153769436 -648.0903733522699 2066.5878153769436",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "398.49718479195076",
    "cy": "1825.731167038745",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M394.49718479195076 1825.731167038745L396.99718479195076 1828.731167038745 401.99718479195076 1823.731167038745",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "398.49718479195076",
    "cy": "1878.731167038745",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M394.49718479195076 1878.731167038745L396.99718479195076 1881.731167038745 401.99718479195076 1876.731167038745",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "398.49718479195076",
    "cy": "1931.731167038745",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M394.49718479195076 1931.731167038745L396.99718479195076 1934.731167038745 401.99718479195076 1929.731167038745",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "398.49718479195076",
    "cy": "1984.731167038745",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M394.49718479195076 1984.731167038745L396.99718479195076 1987.731167038745 401.99718479195076 1982.731167038745",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "3149.2412376796533",
    "r": "9.5",
    "fill": "#929292",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 3149.2412376796533L-653.0903733522699 3152.2412376796533 -648.0903733522699 3147.2412376796533",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "3095.2412376796533",
    "r": "9.5",
    "fill": "#929292",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 3095.2412376796533L-653.0903733522699 3098.2412376796533 -648.0903733522699 3093.2412376796533",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "3203.2412376796533",
    "r": "9.5",
    "fill": "#929292",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 3203.2412376796533L-653.0903733522699 3206.2412376796533 -648.0903733522699 3201.2412376796533",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-304.77325993075533",
    "cy": "2239.940441305402",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-308.77325993075533 2239.940441305402L-306.27325993075533 2242.940441305402 -301.27325993075533 2237.940441305402",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-304.77325993075533",
    "cy": "2184.092572515148",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-308.77325993075533 2184.092572515148L-306.27325993075533 2187.092572515148 -301.27325993075533 2182.092572515148",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "80.27805080215374",
    "cy": "2184.092572515148",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M76.27805080215374 2184.092572515148L78.77805080215374 2187.092572515148 83.77805080215374 2182.092572515148",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "60.27805080215374",
    "cy": "2413.9889354540032",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M56.27805080215374 2413.9889354540032L58.77805080215374 2416.9889354540032 63.77805080215374 2411.9889354540032",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "60.27805080215374",
    "cy": "2254.9889354540032",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M56.27805080215374 2254.9889354540032L58.77805080215374 2257.9889354540032 63.77805080215374 2252.9889354540032",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-304.77325993075533",
    "cy": "2368.4954727616373",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-308.77325993075533 2368.4954727616373L-306.27325993075533 2371.4954727616373 -301.27325993075533 2366.4954727616373",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "4.334276596646873",
    "cy": "2993.724470475211",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M0.33427659664687326 2993.724470475211L2.8342765966468733 2996.724470475211 7.834276596646873 2991.724470475211",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "4.334276596646873",
    "cy": "3093.570561379165",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M0.33427659664687326 3093.570561379165L2.8342765966468733 3096.570561379165 7.834276596646873 3091.570561379165",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "4.334276596646873",
    "cy": "3146.570561379165",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M0.33427659664687326 3146.570561379165L2.8342765966468733 3149.570561379165 7.834276596646873 3144.570561379165",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "159.99718479195076",
    "cy": "2739.778229592709",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M155.99718479195076 2739.778229592709L158.49718479195076 2742.778229592709 163.49718479195076 2737.778229592709",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "159.99718479195076",
    "cy": "2845.778229592709",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M155.99718479195076 2845.778229592709L158.49718479195076 2848.778229592709 163.49718479195076 2843.778229592709",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "159.99718479195076",
    "cy": "2633.778229592709",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M155.99718479195076 2633.778229592709L158.49718479195076 2636.778229592709 163.49718479195076 2631.778229592709",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "159.99718479195076",
    "cy": "2792.778229592709",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M155.99718479195076 2792.778229592709L158.49718479195076 2795.778229592709 163.49718479195076 2790.778229592709",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "159.99718479195076",
    "cy": "2686.778229592709",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M155.99718479195076 2686.778229592709L158.49718479195076 2689.778229592709 163.49718479195076 2684.778229592709",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "398.49718479195076",
    "cy": "3141.347585709834",
    "r": "9.5",
    "fill": "#929292",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M394.49718479195076 3141.347585709834L396.99718479195076 3144.347585709834 401.99718479195076 3139.347585709834",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "398.49718479195076",
    "cy": "3274.75758313553",
    "r": "9.5",
    "fill": "#929292",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M394.49718479195076 3274.75758313553L396.99718479195076 3277.75758313553 401.99718479195076 3272.75758313553",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "159.99718479195073",
    "cy": "3369.1015325696467",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M155.99718479195073 3369.1015325696467L158.49718479195073 3372.1015325696467 163.49718479195073 3367.1015325696467",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "159.99718479195073",
    "cy": "3422.1015325696467",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M155.99718479195073 3422.1015325696467L158.49718479195073 3425.1015325696467 163.49718479195073 3420.1015325696467",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "159.99718479195073",
    "cy": "3475.1015325696467",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M155.99718479195073 3475.1015325696467L158.49718479195073 3478.1015325696467 163.49718479195073 3473.1015325696467",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-649.6697166803284",
    "cy": "3274.75758313553",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-653.6697166803284 3274.75758313553L-651.1697166803284 3277.75758313553 -646.1697166803284 3272.75758313553",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-649.6697166803284",
    "cy": "3327.75758313553",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-653.6697166803284 3327.75758313553L-651.1697166803284 3330.75758313553 -646.1697166803284 3325.75758313553",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-649.6697166803284",
    "cy": "3380.75758313553",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-653.6697166803284 3380.75758313553L-651.1697166803284 3383.75758313553 -646.1697166803284 3378.75758313553",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-233.20798467806267",
    "cy": "1657.0966308599275",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-237.20798467806267 1657.0966308599275L-234.70798467806267 1660.0966308599275 -229.70798467806267 1655.0966308599275",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "60.27805080215374",
    "cy": "2360.9889354540032",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M56.27805080215374 2360.9889354540032L58.77805080215374 2363.9889354540032 63.77805080215374 2358.9889354540032",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "401.17959517325755",
    "cy": "370.7248298360628",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M397.17959517325755 370.7248298360628L399.67959517325755 373.7248298360628 404.67959517325755 368.7248298360628",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "398.49718479195076",
    "cy": "1607.5557520139007",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M394.49718479195076 1607.5557520139007L396.99718479195076 1610.5557520139007 401.99718479195076 1605.5557520139007",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "60.27805080215374",
    "cy": "2307.9889354540032",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M56.27805080215374 2307.9889354540032L58.77805080215374 2310.9889354540032 63.77805080215374 2305.9889354540032",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-413.0903733522699",
    "cy": "2247.396572653209",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-417.0903733522699 2247.396572653209L-414.5903733522699 2250.396572653209 -409.5903733522699 2245.396572653209",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "2300.396572653209",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 2300.396572653209L-653.0903733522699 2303.396572653209 -648.0903733522699 2298.396572653209",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-413.0903733522699",
    "cy": "2353.396572653209",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-417.0903733522699 2353.396572653209L-414.5903733522699 2356.396572653209 -409.5903733522699 2351.396572653209",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-413.0903733522699",
    "cy": "2300.396572653209",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-417.0903733522699 2300.396572653209L-414.5903733522699 2303.396572653209 -409.5903733522699 2298.396572653209",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-651.5903733522699",
    "cy": "2406.396572653209",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-655.5903733522699 2406.396572653209L-653.0903733522699 2409.396572653209 -648.0903733522699 2404.396572653209",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-413.0903733522699",
    "cy": "2406.396572653209",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-417.0903733522699 2406.396572653209L-414.5903733522699 2409.396572653209 -409.5903733522699 2404.396572653209",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "5.292015321937328",
    "cy": "2695.7125572601244",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M1.2920153219373276 2695.7125572601244L3.7920153219373276 2698.7125572601244 8.792015321937328 2693.7125572601244",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "5.292015321937328",
    "cy": "2748.7125572601244",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M1.2920153219373276 2748.7125572601244L3.7920153219373276 2751.7125572601244 8.792015321937328 2746.7125572601244",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "5.292015321937328",
    "cy": "2801.7125572601244",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M1.2920153219373276 2801.7125572601244L3.7920153219373276 2804.7125572601244 8.792015321937328 2799.7125572601244",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "5.292015321937328",
    "cy": "2907.7125572601244",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M1.2920153219373276 2907.7125572601244L3.7920153219373276 2910.7125572601244 8.792015321937328 2905.7125572601244",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "5.292015321937328",
    "cy": "2854.7125572601244",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M1.2920153219373276 2854.7125572601244L3.7920153219373276 2857.7125572601244 8.792015321937328 2852.7125572601244",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-652.6786501592425",
    "cy": "846.4210937030621",
    "r": "9.5",
    "fill": "#874efe",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-656.6786501592425 846.4210937030621L-654.1786501592425 849.4210937030621 -649.1786501592425 844.4210937030621",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-652.6786501592425",
    "cy": "952.4210937030621",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-656.6786501592425 952.4210937030621L-654.1786501592425 955.4210937030621 -649.1786501592425 950.4210937030621",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-652.6786501592425",
    "cy": "899.4210937030621",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-656.6786501592425 899.4210937030621L-654.1786501592425 902.4210937030621 -649.1786501592425 897.4210937030621",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  },
  {
    "kind": "circle",
    "cx": "-652.6786501592425",
    "cy": "1005.4210937030621",
    "r": "9.5",
    "fill": "#4f7a28",
    "id": "icon-link"
  },
  {
    "kind": "path",
    "d": "M-656.6786501592425 1005.4210937030621L-654.1786501592425 1008.4210937030621 -649.1786501592425 1003.4210937030621",
    "stroke": "#fff",
    "strokeWidth": "2",
    "strokeDasharray": null,
    "dataEdgeId": null
  }
];
