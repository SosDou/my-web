import { notFound } from 'next/navigation';
import { isLocale, PageParams } from './config';

// 定义字典对象，包含每个语言环境对应的字典加载函数
const dictionaries = {
    'us-en': () => import('../i18n/dictionaries/us-en.json').then((module) => module.default),
    'cn-zh': () => import('../i18n/dictionaries/cn-zh.json').then((module) => module.default)
}

// 获取对应语言的字典
export async function translation(params: Promise<PageParams>) {
    // 获取 params 中的 语言环境
    const { lang } = await params;

    // 验证 lang 是否为有效的语言代码
    if (!isLocale(lang)) {
        notFound();
    }

    // 返回对应语言的字典
    return await dictionaries[lang]();
}