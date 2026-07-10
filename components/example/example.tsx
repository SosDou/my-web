import { translation } from "@/i18n/translation";
import { PageProps } from "@/i18n/config";

export default async function Example({ params }: PageProps) {
    const t = await translation(params);

    return (
        <div className="example">
            <h1>
                {t.example.title}
            </h1>
        </div>
    );
}