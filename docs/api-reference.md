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

declare interface CharacterIdentifiers {
    readonly codePoint: number;
    readonly source: string;
}

declare interface CharacterSvgData {
    readonly strokes: readonly Stroke[];
    readonly transform: string | null;
    readonly viewBox: string;
}

declare interface Character extends CharacterIdentifiers, CharacterSvgData {}
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

declare interface StrokesLoader {
    (codePoint: number): Promise<Character>;
}

declare interface StrokesLoaderComponents {
    source: StrokesSource;
    convert?: StrokesConverter;
    request: StrokesRequester;
    parse: StrokesParser;
}
```

### Formats
`StrokesFormat` is a string constant denoting a supported format. Use the [exported function](#exported-functions) `getFormats` to get supported sources.
```typescript
declare interface AnimationOptions {
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
    readonly interactive: boolean;
}

declare interface StrokesAnimator {
    (character: Character, options: AnimationOptions): Element;
}
```

## Exported Functions
```typescript
declare function getSources(): ReadonlySet<StrokesSource>;
declare function getFormats(): ReadonlySet<StrokesFormat>;
declare function getFullOptions(partialOptions?: Partial<AnimationOptions>): AnimationOptions;

declare function getLoader(source: StrokesSource): StrokesLoader;
declare function getAnimator(format: StrokesFormat): StrokesAnimator;

declare function getRequester(source: StrokesSource): StrokesRequester;
declare function getParser(source: StrokesSource): StrokesParser;
declare function buildLoader(components: StrokesLoaderComponents): StrokesLoader;



declare interface StrokesRenderer {
    (characterString: string): Promise<Element>;
}
declare interface StrokesRendererFactoryArguments {
    source?: StrokesSource;
    format?: StrokesFormat;
    options?: Partial<AnimationOptions>;
    loader?: StrokesLoader;
    animator?: StrokesAnimator;
}
declare function strokes(args: StrokesRendererFactoryArguments): StrokesRenderer;
```