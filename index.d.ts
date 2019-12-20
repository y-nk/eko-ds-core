export declare const FROM = "from";
export declare const TO = "to";
export declare type NodeId = string;
export declare type Node = {
    id: NodeId;
};
export declare type Edge = {
    [FROM]: NodeId;
    [TO]: NodeId;
    cost: number;
};
export declare type Route = Edge[];
export declare type Graph = {
    nodes: Record<NodeId, Node>;
    edges: Edge[];
};
export declare type Direction = (typeof FROM | typeof TO);
declare type Filter = (route: Route) => boolean;
export declare const add: (context: Graph, node: string, data?: object) => Node;
export declare const del: (context: Graph, node: string) => void;
export declare const link: (context: Graph, from: string, to: string, cost: number, data?: object) => Edge;
export declare const unlink: (context: Graph, from: string, to: string) => void;
export declare const edgesOf: (context: Graph, node: string, direction?: "from" | "to" | undefined) => Edge[];
export declare const edgeFor: (context: Graph, from: string, to: string) => Edge;
export declare const routeFor: (context: Graph, nodes: string[]) => Route;
export declare const costOf: (route: Route) => number;
export declare const routesFor: (context: Graph, from: string, to: string, filter?: Filter, occurences?: number) => Route[];
export {};
//# sourceMappingURL=index.d.ts.map