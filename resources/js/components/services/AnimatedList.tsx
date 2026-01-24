import { motion, useInView } from 'motion/react';
import type { ReactNode, UIEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import './AnimatedList.css';

interface AnimatedItemProps {
    children: ReactNode;
    delay?: number;
    index: number;
    onMouseEnter?: (index: number) => void;
    onClick: () => void;
    scrollDirection: 'up' | 'down';
}

const AnimatedItem = ({ children, delay = 0, index, onMouseEnter, onClick, scrollDirection }: AnimatedItemProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { amount: 0.5 });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (inView && scrollDirection === 'down' && !hasAnimated) {
            setHasAnimated(true);
        }
    }, [inView, scrollDirection, hasAnimated]);

    return (
        <motion.div
            ref={ref}
            data-index={index}
            onMouseEnter={onMouseEnter ? () => onMouseEnter(index) : undefined}
            onClick={onClick}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={hasAnimated ? { scale: 1, opacity: 1 } : { scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.2, delay }}
            className="cursor-pointer"
        >
            {children}
        </motion.div>
    );
};

interface AnimatedListProps<T> {
    items: T[];
    onItemSelect?: (item: T, index: number) => void;
    renderItem?: (item: T, index: number, isSelected: boolean) => ReactNode;
    showGradients?: boolean;
    enableArrowNavigation?: boolean;
    className?: string;
    listClassName?: string;
    itemClassName?: string;
    displayScrollbar?: boolean;
    initialSelectedIndex?: number;
    scrollable?: boolean;
}

const AnimatedList = <T,>({
    items,
    onItemSelect,
    renderItem,
    showGradients = true,
    enableArrowNavigation = true,
    className = '',
    listClassName = '',
    itemClassName = '',
    displayScrollbar = true,
    initialSelectedIndex = -1,
    scrollable = true,
}: AnimatedListProps<T>) => {
    const listRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
    const [keyboardNav, setKeyboardNav] = useState(false);
    const [topGradientOpacity, setTopGradientOpacity] = useState(0);
    const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);
    const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down');
    const lastWindowScrollYRef = useRef<number>(0);
    const lastContainerScrollTopRef = useRef<number>(0);

    const handleItemMouseEnter = useCallback((index: number) => {
        setSelectedIndex(index);
    }, []);

    const handleItemClick = useCallback(
        (item: T, index: number) => {
            setSelectedIndex(index);
            if (onItemSelect) {
                onItemSelect(item, index);
            }
        },
        [onItemSelect],
    );

    const handleScroll = useCallback(
        (e: UIEvent<HTMLDivElement>) => {
            if (!scrollable) return;
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

            setScrollDirection(scrollTop >= lastContainerScrollTopRef.current ? 'down' : 'up');
            lastContainerScrollTopRef.current = scrollTop;

            setTopGradientOpacity(Math.min(scrollTop / 50, 1));
            const bottomDistance = scrollHeight - (scrollTop + clientHeight);
            setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
        },
        [scrollable],
    );

    useEffect(() => {
        if (scrollable) {
            return;
        }

        lastWindowScrollYRef.current = window.scrollY;

        const onWindowScroll = () => {
            const next = window.scrollY;
            setScrollDirection(next >= lastWindowScrollYRef.current ? 'down' : 'up');
            lastWindowScrollYRef.current = next;
        };

        window.addEventListener('scroll', onWindowScroll, { passive: true });
        return () => window.removeEventListener('scroll', onWindowScroll);
    }, [scrollable]);

    useEffect(() => {
        if (!enableArrowNavigation) return;
        const handleKeyDown = (e: globalThis.KeyboardEvent) => {
            if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
                e.preventDefault();
                setKeyboardNav(true);
                setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
            } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
                e.preventDefault();
                setKeyboardNav(true);
                setSelectedIndex((prev) => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter') {
                if (selectedIndex >= 0 && selectedIndex < items.length) {
                    e.preventDefault();
                    if (onItemSelect) {
                        onItemSelect(items[selectedIndex], selectedIndex);
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

    useEffect(() => {
        if (!scrollable || !keyboardNav || selectedIndex < 0 || !listRef.current) return;
        const container = listRef.current;
        const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`) as HTMLElement | null;
        if (selectedItem) {
            const extraMargin = 50;
            const containerScrollTop = container.scrollTop;
            const containerHeight = container.clientHeight;
            const itemTop = selectedItem.offsetTop;
            const itemBottom = itemTop + selectedItem.offsetHeight;
            if (itemTop < containerScrollTop + extraMargin) {
                container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
            } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
                container.scrollTo({
                    top: itemBottom - containerHeight + extraMargin,
                    behavior: 'smooth',
                });
            }
        }
        setKeyboardNav(false);
    }, [selectedIndex, keyboardNav, scrollable]);

    return (
        <div className={`scroll-list-container ${className}`}>
            <div ref={listRef} className={`scroll-list ${!displayScrollbar ? 'no-scrollbar' : ''} ${listClassName}`} onScroll={handleScroll}>
                {items.map((item, index) => (
                    <AnimatedItem
                        key={index}
                        delay={0.1}
                        index={index}
                        onMouseEnter={handleItemMouseEnter}
                        onClick={() => handleItemClick(item, index)}
                        scrollDirection={scrollDirection}
                    >
                        {renderItem ? (
                            renderItem(item, index, selectedIndex === index)
                        ) : (
                            <div className={`mb-4 rounded-lg bg-[#170d27] p-4 ${selectedIndex === index ? 'bg-[#271e37]' : ''} ${itemClassName}`}>
                                <p className="m-0 text-white">{String(item)}</p>
                            </div>
                        )}
                    </AnimatedItem>
                ))}
            </div>
            {showGradients && (
                <>
                    <div
                        className="pointer-events-none absolute top-0 right-0 left-0 h-[50px] bg-gradient-to-b from-[#060010] to-transparent transition-opacity"
                        style={{ opacity: topGradientOpacity }}
                    ></div>
                    <div
                        className="pointer-events-none absolute right-0 bottom-0 left-0 h-[100px] bg-gradient-to-t from-[#060010] to-transparent transition-opacity"
                        style={{ opacity: bottomGradientOpacity }}
                    ></div>
                </>
            )}
        </div>
    );
};

export default AnimatedList;
