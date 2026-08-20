<template>
    <section class="qa-list my-6">
        <!-- 可选头部：标题 + 计数 + 全部展开/收起 -->
        <header
            v-if="title || (!accordion && items.length > 1)"
            class="qa-header"
        >
            <div class="qa-header-left">
                <h3 v-if="title" class="qa-title">{{ title }}</h3>
                <span v-if="items.length" class="qa-count">共 {{ items.length }} 条</span>
            </div>

            <button
                v-if="!accordion && items.length > 1"
                type="button"
                class="qa-toggle-all"
                @click="toggleAll"
            >
                {{ allOpen ? '全部收起' : '全部展开' }}
            </button>
        </header>

        <ul class="qa-items">
            <li
                v-for="entry in allWithIndex"
                :key="entry.index"
                class="qa-item"
                :class="{ 'is-open': isOpen(entry.index) }"
            >
                <h4 class="qa-heading">
                    <button
                        type="button"
                        class="qa-trigger"
                        :aria-expanded="isOpen(entry.index)"
                        :aria-controls="`${uid}-panel-${entry.index}`"
                        :id="`${uid}-trigger-${entry.index}`"
                        @click="toggle(entry.index)"
                    >
                        <span class="qa-question">{{ entry.item.question }}</span>
                        <span class="qa-chevron" aria-hidden="true">
                            <svg
                                viewBox="0 0 24 24"
                                width="18"
                                height="18"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </span>
                    </button>
                </h4>

                <div class="qa-panel" :class="{ 'is-open': isOpen(entry.index) }">
                    <div class="qa-panel-clip">
                        <div
                            role="region"
                            :id="`${uid}-panel-${entry.index}`"
                            :aria-labelledby="`${uid}-trigger-${entry.index}`"
                            class="qa-answer"
                        >
                            {{ entry.item.answer }}
                        </div>
                    </div>
                </div>
            </li>
        </ul>

        <!-- 空状态 -->
        <div v-if="allWithIndex.length === 0" class="qa-empty">暂无内容 / No Content</div>
    </section>
</template>

<script lang="ts" setup>
import { ref, computed, watch, useId, type PropType } from 'vue';

interface QAItem {
    question: string;
    answer: string;
}

const props = defineProps({
    items: {
        type: Array as PropType<QAItem[]>,
        default: () => [],
    },
    /** 手风琴模式：同时只展开一项 */
    accordion: {
        type: Boolean,
        default: true,
    },
    /** 初始展开的索引，支持单个或数组 */
    initialOpen: {
        type: [Number, Array] as PropType<number | number[] | null>,
        default: null,
    },
    /** 可选标题，留空则不渲染头部 */
    title: {
        type: String,
        default: '',
    },
});

// SSR 与客户端一致的唯一 id，用于 aria-controls / aria-labelledby
const uid = useId();

const openSet = ref(new Set<number>());

function setInitialOpen() {
    openSet.value.clear();
    if (props.initialOpen == null) return;
    if (Array.isArray(props.initialOpen)) {
        props.initialOpen.forEach((i: number) => openSet.value.add(i));
    } else {
        openSet.value.add(Number(props.initialOpen));
    }
}

setInitialOpen();
watch(() => props.initialOpen, setInitialOpen);

const allWithIndex = computed(() => props.items.map((item, index) => ({ item, index })));

const allOpen = computed(() => props.items.length > 0 && openSet.value.size === props.items.length);

function toggle(idx: number) {
    if (openSet.value.has(idx)) {
        openSet.value.delete(idx);
        return;
    }
    if (props.accordion) openSet.value.clear();
    openSet.value.add(idx);
}

function toggleAll() {
    if (allOpen.value) {
        openSet.value.clear();
    } else {
        openSet.value = new Set(props.items.map((_, i) => i));
    }
}

function isOpen(idx: number) {
    return openSet.value.has(idx);
}
</script>

<style scoped>
/* 统一的排版基准：答案与问题共享同一文本列 */
.qa-list {
    --qa-pad-x: 1rem;
    --qa-row-height: 1.375rem;
    --qa-chevron-size: 1.125rem;
    --qa-gap: 0.75rem;
}

/* ---------- 头部 ---------- */
.qa-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.75rem;
}

.qa-header-left {
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
}

.qa-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

.qa-count {
    font-size: 0.75rem;
    color: var(--vp-c-text-3);
}

.qa-toggle-all {
    flex-shrink: 0;
    padding: 0.25rem 0.625rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.375rem;
    background-color: transparent;
    color: var(--vp-c-text-2);
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
    transition:
        color 0.2s ease,
        border-color 0.2s ease;
}

.qa-toggle-all:hover {
    color: var(--vp-c-brand-1);
    border-color: var(--vp-c-brand-1);
}

.qa-toggle-all:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
}

/* ---------- 列表 ---------- */
.qa-items {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.qa-item {
    overflow: hidden;
    border: 1px solid var(--vp-c-divider);
    border-radius: 0.5rem;
    background-color: var(--vp-c-bg-soft);
    transition:
        border-color 0.2s ease,
        background-color 0.2s ease;
}

.qa-item:hover {
    border-color: var(--vp-c-brand-1);
}

.qa-item.is-open {
    border-color: var(--vp-c-brand-1);
}

/* ---------- 问题行 ---------- */
.qa-heading {
    margin: 0;
    /* 抵消 VitePress 对 h4 的默认排版 */
    padding: 0;
    border: none;
    font-size: inherit;
    line-height: inherit;
}

.qa-trigger {
    display: flex;
    align-items: flex-start;
    gap: var(--qa-gap);
    width: 100%;
    padding: 0.75rem var(--qa-pad-x);
    border: none;
    background: transparent;
    font: inherit;
    color: inherit;
    text-align: left;
    cursor: pointer;
}

.qa-trigger:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: -2px;
}

.qa-question {
    flex: 1;
    font-size: 0.9375rem;
    font-weight: 600;
    /* 与箭头视觉居中对齐 */
    line-height: var(--qa-row-height);
    color: var(--vp-c-text-1);
    transition: color 0.2s ease;
}

.qa-item.is-open .qa-question {
    color: var(--vp-c-brand-1);
}

.qa-chevron {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    height: var(--qa-row-height);
    color: var(--vp-c-text-3);
    transition:
        transform 0.25s ease,
        color 0.2s ease;
}

.qa-item.is-open .qa-chevron {
    transform: rotate(180deg);
    color: var(--vp-c-brand-1);
}

/* ---------- 答案面板 ---------- */
.qa-panel {
    display: grid;
    grid-template-rows: 0fr;
    /* 关闭时移出无障碍树，避免屏幕阅读器读到隐藏内容 */
    visibility: hidden;
    transition:
        grid-template-rows 0.25s ease,
        visibility 0.25s;
}

.qa-panel.is-open {
    grid-template-rows: 1fr;
    visibility: visible;
}

.qa-panel-clip {
    overflow: hidden;
    min-height: 0;
}

.qa-answer {
    /* 左侧与问题文字同起点，右侧让出箭头，使两者共享同一文本列 */
    padding: 0.75rem calc(var(--qa-pad-x) + var(--qa-chevron-size) + var(--qa-gap)) 0.875rem
        var(--qa-pad-x);
    border-top: 1px solid var(--vp-c-divider);
    font-size: 0.875rem;
    line-height: 1.75;
    color: var(--vp-c-text-2);
    white-space: pre-wrap;
}

/* ---------- 空状态 ---------- */
.qa-empty {
    padding: 2.5rem;
    border: 1px dashed var(--vp-c-divider);
    border-radius: 0.5rem;
    text-align: center;
    font-size: 0.875rem;
    color: var(--vp-c-text-3);
}

/* ---------- 窄屏 ---------- */
@media (max-width: 640px) {
    .qa-list {
        --qa-pad-x: 0.75rem;
    }

    .qa-answer {
        /* 移动端不为箭头留白，为正文让出宽度 */
        padding-right: var(--qa-pad-x);
    }
}

/* ---------- 降低动效偏好 ---------- */
@media (prefers-reduced-motion: reduce) {
    .qa-item,
    .qa-question,
    .qa-chevron,
    .qa-panel,
    .qa-toggle-all {
        transition: none;
    }
}
</style>
