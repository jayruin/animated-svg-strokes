# API Reference

## Models

### Core
`StrokesSource` is a string constant denoting a supported source. Use the [exported function](#exported-functions) `getSources` to get supported sources.
```typescript

declare interface Stroke {
    readonly clipPath: string | null;
    readonly strokePath: string;
    readonly strokeWidth: number;
}

declare interface CharacterSvgData {
    readonly strokes: readonly Stroke[];
    readonly transform: string | null;
    readonly viewBox: string;
}

declare interface Character extends CharacterSvgData {
    readonly codePoint: number;
    readonly source: string;
}
```

### Sources
```typescript
declare interface StrokesConverter {
    (codePoint: number): Promise<number>;
}

declare interface StrokesRequester {
    (codePoint: number): Promise<Response>;
}

declare interface StrokesParser {
    (response: Response): Promise<CharacterSvgData>;
}

declare interface StrokesSourceComponents {
    source: string;
    converter?: StrokesConverter;
    requester: StrokesRequester;
    parser: StrokesParser;
}
```

### Formats
Use the [exported function](#exported-functions) `getFormats` to get supported formats.
```typescript
declare interface StrokesAnimationOptions {
    readonly includeGrid: boolean;
    readonly gridColor: string;
    readonly gridRows: number;
    readonly gridColumns: number;
    readonly includeBackground: boolean;
    readonly backgroundColor: string;
    readonly includePreview: boolean;
    readonly previewColor: string;
    readonly strokeColor: string;
    readonly pauseRatio: number;
    readonly totalStrokeDuration: number;
}

declare interface StrokesAnimation {
    readonly element: Element;
    readonly dispose: () => void;
    readonly isPaused: () => boolean;
    readonly pause: () => void;
    readonly resume: () => void;
}

declare interface StrokesAnimator {
    (character: CharacterSvgData, options: StrokesAnimationOptions): StrokesAnimation;
}

declare interface StrokesFormatComponents {
    readonly format: string;
    readonly animator: StrokesAnimator;
}
```

## Exported Functions
```typescript
declare function getSources(): ReadonlySet<string>;
declare function getSourceComponents(source: string);
declare function registerSource = (components: StrokesSourceComponents): void;

declare function getFormats(): ReadonlySet<string>;
declare function getFormatComponents(format: string): StrokesFormatComponents;
declare function registerFormat(components: StrokesFormatComponents): void;

declare function getFullOptions(partialOptions?: Partial<StrokesAnimationOptions>): StrokesAnimationOptions;


declare interface StrokesCharacterAnimation extends StrokesAnimation {
    readonly codePoint: number;
    readonly source: string;
    readonly format: string;
}
declare interface StrokesRenderer {
    (characterString: string): Promise<StrokesCharacterAnimation>;
}
declare interface StrokesRendererFactoryArguments {
    source: string;
    format: string;
    options?: Partial<StrokesAnimationOptions>;
}
declare function strokes(args: StrokesRendererFactoryArguments): StrokesRenderer;
```