declare module 'troika-three-text' {
	import { Mesh } from 'three';

	export class Text extends Mesh {
		text: string;
		fontSize: number;
		anchorX: string | number;
		anchorY: string | number;
		sdfGlyphSize: number;
		letterSpacing: number;
		fillOpacity: number;
		color: string | number;
		strokeColor: string | number;
		strokeWidth: string | number;
		strokeOpacity: number;
		outlineColor: string | number;
		outlineWidth: string | number;
		outlineBlur: string | number;
		outlineOpacity: number;
		sync(): void;
		dispose(): void;
	}
}
