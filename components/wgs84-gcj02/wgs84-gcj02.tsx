import type { Dictionary } from "@/i18n/dictionaries/types";
import { ArticleCodeBlock } from "@/components/wgs84-gcj02/codes";
import { TableOfContents } from "@/components/wgs84-gcj02/table-of-contents";
import { WGS84GCJ02Formulas } from "@/components/wgs84-gcj02/formulas";
import { CoordinateComparisonMap } from "@/components/wgs84-gcj02/coordinate-comparison-map";
import { CoordinateOffsetSurface } from "@/components/wgs84-gcj02/coordinate-offset-surface";
import { MathBlock } from "../ui/math-block";

type WGS84GCJ02ArticleProps = {
    mapTranslations: Dictionary["map"];
    translations: Dictionary["wgs84Gcj02"];
    visualizationTranslations: Dictionary["visualizationWindow"];
};

export function WGS84GCJ02Article({
    mapTranslations,
    translations,
    visualizationTranslations,
}: WGS84GCJ02ArticleProps) {
    const {
        overview,
        differences,
        conversion,
        explanation,
        constants,
        offsetFormulas,
        forward,
        inverse,
        origins,
        polynomial,
        squareRoot,
        sine,
    } = translations.sections;

    return (
        <article className="page-container page-shell">
            <TableOfContents translations={translations} />

            <div className="article-body mt-[var(--ds-gap-stack-lg)] w-full text-left text-[var(--ds-color-foreground)]">
                <h1 id="article-title" className="scroll-mt-6">{translations.title}</h1>
                <p>{translations.meta}</p>

                <hr className="my-6 border-t border-[var(--color-border)] max-sm:my-5" />

                <h2 id="what-is-wgs84-gcj02" className="scroll-mt-6">{overview.title}</h2>
                <p>{overview.wgs84}</p>
                <p>{overview.gcj02}</p>

                <h2 id="wgs84-gcj02-differences" className="scroll-mt-6">{differences.title}</h2>
                <p>{differences.description}</p>
                <p>{differences.conclusion}</p>
                <CoordinateComparisonMap labels={translations.map} mapLabels={mapTranslations} />

                <h2 id="wgs84-gcj02-conversion" className="scroll-mt-6">{conversion.title}</h2>
                <p>{conversion.description}</p>
                <ArticleCodeBlock ariaLabel={translations.codeLanguageLabel} />

                <h2 id="conversion-explanation" className="scroll-mt-6">{explanation.title}</h2>
                <p>{explanation.introduction}</p>

                <h3 id="conversion-constants" className="scroll-mt-6">{constants.title}</h3>
                <p className="font-semibold">{constants.chinaRangeTitle}</p>
                <p>{constants.chinaRangeIntroduction}</p>
                <MathBlock>{WGS84GCJ02Formulas.chinaBoundsString}</MathBlock>
                <p>{constants.chinaRangeDetails}</p>

                <p className="font-semibold">{constants.ellipsoidTitle}</p>
                <p>{constants.ellipsoidDescription}</p>
                <MathBlock>{WGS84GCJ02Formulas.aString}</MathBlock>
                <MathBlock>{WGS84GCJ02Formulas.e2String}</MathBlock>

                <h3 id="coordinate-offset-formulas" className="scroll-mt-6">{offsetFormulas.title}</h3>
                <p>{offsetFormulas.introduction}</p>
                <MathBlock>{WGS84GCJ02Formulas.longitudeAndLatitudeToReferencePointOffsetString}</MathBlock>

                <p className="font-semibold">{offsetFormulas.longitudeTitle}</p>
                <p>{offsetFormulas.longitudeDescription}</p>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionString}</MathBlock>

                <p className="font-semibold">{offsetFormulas.latitudeTitle}</p>
                <p>{offsetFormulas.latitudeDescription}</p>
                <MathBlock>{WGS84GCJ02Formulas.latitudeOffsetFunctionString}</MathBlock>

                <h3 id="wgs84-to-gcj02" className="scroll-mt-6">{forward.title}</h3>
                <p className="font-semibold">{forward.initialOffsetTitle}</p>
                <p>{forward.initialOffsetDescription}</p>
                <MathBlock>{WGS84GCJ02Formulas.initialLongitudeAndLatitudeOffsetString}</MathBlock>

                <p className="font-semibold">{forward.ellipsoidCorrectionTitle}</p>
                <p>{forward.ellipsoidCorrectionDescription}</p>
                <MathBlock>{WGS84GCJ02Formulas.latitudeRadiansString}</MathBlock>
                <MathBlock>{WGS84GCJ02Formulas.ellipsoidCorrectionFactorString}</MathBlock>
                <MathBlock>{WGS84GCJ02Formulas.ellipsoidCorrectionFactorRootString}</MathBlock>

                <p className="font-semibold">{forward.latitudeOffsetTitle}</p>
                <p>{forward.latitudeOffsetDescription}</p>
                <MathBlock>{WGS84GCJ02Formulas.latitudeOffsetString}</MathBlock>

                <p className="font-semibold">{forward.longitudeOffsetTitle}</p>
                <p>{forward.longitudeOffsetDescription}</p>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetString}</MathBlock>
                <CoordinateOffsetSurface
                    labels={translations.surface}
                    windowTranslations={visualizationTranslations}
                />

                <p className="font-semibold">{forward.resultTitle}</p>
                <p>{forward.resultDescription}</p>
                <MathBlock>{WGS84GCJ02Formulas.wgs84ToGcj02LongitudeAndLatitudeString}</MathBlock>
                <p>{forward.notation}</p>

                <h3 id="gcj02-to-wgs84" className="scroll-mt-6">{inverse.title}</h3>
                <p>{inverse.introduction}</p>

                <p className="font-semibold">{inverse.initializeTitle}</p>
                <p>{inverse.initializeInput}</p>
                <MathBlock>{WGS84GCJ02Formulas.gcj02OriginalCoordinatesString}</MathBlock>
                <p>{inverse.initializeEstimate}</p>
                <MathBlock>{WGS84GCJ02Formulas.initialWgs84LongitudeAndLatitudeString}</MathBlock>

                <p className="font-semibold">{inverse.errorTitle}</p>
                <p>{inverse.prediction}</p>
                <MathBlock>{WGS84GCJ02Formulas.wgs84ToGcj02FunctionString}</MathBlock>
                <p>{inverse.error}</p>
                <MathBlock>{WGS84GCJ02Formulas.longitudeAndLatitudeErrorString}</MathBlock>

                <p className="font-semibold">{inverse.correctionTitle}</p>
                <p>{inverse.correction}</p>
                <MathBlock>{WGS84GCJ02Formulas.longitudeAndLatitudeCorrectionString}</MathBlock>

                <p className="font-semibold">{inverse.terminationTitle}</p>
                <p>{inverse.termination}</p>
                <MathBlock>{WGS84GCJ02Formulas.iterationTerminationConditionString}</MathBlock>
                <p>{inverse.terminationLimit}</p>

                <p className="font-semibold">{inverse.resultTitle}</p>
                <p>{inverse.result}</p>
                <MathBlock>{WGS84GCJ02Formulas.gcj02ToWgs84LongitudeAndLatitudeString}</MathBlock>

                <h2 id="wait-why" className="scroll-mt-6">{origins.title}</h2>
                <p>{origins.questionIntroduction}</p>

                <p className="font-semibold">{origins.longitudeTitle}</p>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionString}</MathBlock>

                <p className="font-semibold">{origins.latitudeTitle}</p>
                <MathBlock>{WGS84GCJ02Formulas.latitudeOffsetFunctionString}</MathBlock>

                <p>{origins.question}</p>
                <p>{origins.model}</p>
                <MathBlock>{WGS84GCJ02Formulas.disturbanceModelString}</MathBlock>
                <p>{origins.components}</p>
                <p>{origins.longitudeExample}</p>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionDescriptionString}</MathBlock>

                <h3 id="part-polynomial" className="scroll-mt-6">{polynomial.title}</h3>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionPolynomialPartString}</MathBlock>
                <p>{polynomial.description}</p>
                <p>{polynomial.coefficients}</p>

                <h3 id="part-square-root" className="scroll-mt-6">{squareRoot.title}</h3>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionSquareRootPartString}</MathBlock>
                <p>{squareRoot.description}</p>
                <p>{squareRoot.coefficient}</p>

                <h3 id="part-sine-disturbance" className="scroll-mt-6">{sine.title}</h3>
                <MathBlock>{WGS84GCJ02Formulas.longitudeOffsetFunctionSineDisturbancePartString}</MathBlock>
                <p>{sine.description}</p>
                <MathBlock>{WGS84GCJ02Formulas.sineFunctionPeriodString}</MathBlock>
                <p>{sine.example}</p>
                <MathBlock>{WGS84GCJ02Formulas.sineFunctionPeriodExampleString}</MathBlock>
                <p>{sine.tableIntroduction}</p>

                <table>
                    <thead>
                        <tr>
                            <th scope="col">{sine.functionHeader}</th>
                            <th scope="col">{sine.amplitudeHeader}</th>
                            <th scope="col">{sine.periodHeader}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(6πx)</span></td>
                            <td><span className="whitespace-nowrap">40/3</span></td>
                            <td><span className="whitespace-nowrap">1/3°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(2πx)</span></td>
                            <td><span className="whitespace-nowrap">40/3</span></td>
                            <td><span className="whitespace-nowrap">1°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(πx)</span></td>
                            <td><span className="whitespace-nowrap">40/3</span></td>
                            <td><span className="whitespace-nowrap">2°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(πx/3)</span></td>
                            <td><span className="whitespace-nowrap">80/3</span></td>
                            <td><span className="whitespace-nowrap">6°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(πx/12)</span></td>
                            <td><span className="whitespace-nowrap">100</span></td>
                            <td><span className="whitespace-nowrap">24°</span></td>
                        </tr>
                        <tr>
                            <td><span className="whitespace-nowrap">sin(πx/30)</span></td>
                            <td><span className="whitespace-nowrap">200</span></td>
                            <td><span className="whitespace-nowrap">60°</span></td>
                        </tr>
                    </tbody>
                </table>

                <p>{sine.amplitudeExplanation}</p>
                <p>{sine.conclusion}</p>
            </div>
        </article>
    );
}
