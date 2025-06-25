import "./top-toys.css";
import {FaChevronLeft, FaChevronRight} from "react-icons/fa";
import {useEffect, useRef, useState} from "react";
import {StarRating} from "@/components/util/StarRating";
import topToysDataJson from "./data/topToysData_full_svg_all.json";
import CarouselModal from "@/components/sections/top-toys/product-modal/CarouselModal";
import {useModalHistory} from "@/hooks/useModalHistory";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";


interface TopToysItem {
    id: string;
    rank: string;
    title: string;
    desc?: string;
    rate?: number;
    href: string;
    imgSrc: string;
    svgViewBox: string;
    svgPath: string;
    confeti?: boolean;
    typeConfeti?: string;
}

const topToysData: TopToysItem[] = topToysDataJson as TopToysItem[];

export default function TopToys() {

    const sliderMaskRef = useRef<HTMLDivElement>(null);
    const sectionRef = useRef<HTMLElement>(null);


    const [activePage, setActivePage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [cardWidth, setCardWidth] = useState(0);
    // Estado para o modal
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    // Ref para controle da animação (para evitar cliques rápidos)
    const isAnimating = useRef(false);
    // Estado para detectar se está em mobile (largura <= 768px)
    const [isMobile, setIsMobile] = useState(false);

    const sortedData = [...topToysData].sort(
        (a, b) => parseInt(a.rank) - parseInt(b.rank)
    );

    const [openModal, setOpenModal] = useState(false);
    useModalHistory(openModal, setOpenModal);

    const handleOpenModal = (i: number) => {
        // (re)cria a almofada se ela não existir ainda
        if (history.state?.modal !== true) {
            window.history.pushState({ modal: true }, "");
        }

        setSelectedIndex(i);
        setOpenModal(true);        // hook só instala o listener
    };


    // Mede o tamanho do primeiro card para termos a largura individual
    const updateDimensions = () => {
        if (sliderMaskRef.current) {
            const firstCard = sliderMaskRef.current.querySelector(
                ".slider-item"
            ) as HTMLElement;
            if (firstCard) {
                const cardW = firstCard.getBoundingClientRect().width;
                setCardWidth(cardW);
                // console.log("[updateDimensions]", {
                //     maskWidth: sliderMaskRef.current.getBoundingClientRect().width,
                //     cardW,
                // });
            }
        }
    };

    // Atualiza a página ativa com base na posição do scroll e na largura do container
    const updatePagination = () => {
        if (sliderMaskRef.current && cardWidth) {
            const { scrollLeft, offsetWidth } = sliderMaskRef.current;
            const totalContentWidth = sortedData.length * cardWidth;
            const pages = Math.ceil(totalContentWidth / offsetWidth);
            let newPage = Math.round(scrollLeft / offsetWidth);
            const maxScrollLeft = totalContentWidth - offsetWidth;
            if (scrollLeft >= maxScrollLeft - 5) {
                newPage = pages - 1;
            }
            setActivePage(newPage);
            setTotalPages(pages);
        }
    };

    useEffect(() => {
        // Função para detectar se a tela é mobile
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
            updateDimensions();
            updatePagination();
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        const sliderEl = sliderMaskRef.current;
        if (sliderEl) {
            sliderEl.addEventListener("scroll", updatePagination);
        }
        return () => {
            window.removeEventListener("resize", handleResize);
            if (sliderEl) {
                sliderEl.removeEventListener("scroll", updatePagination);
            }
        };
    }, [cardWidth]);

    // Função para verificar e corrigir elementos visíveis
    const checkVisibleElements = () => {
        if (!sliderMaskRef.current) return;

        const container = sliderMaskRef.current;
        const scrollLeft = container.scrollLeft;
        const containerWidth = container.offsetWidth;
        const cards = container.querySelectorAll('.slider-item');

        cards.forEach((card: Element) => {
            const cardEl = card as HTMLElement;
            const cardLeft = cardEl.offsetLeft;
            const cardWidth = cardEl.offsetWidth;
            const cardRight = cardLeft + cardWidth;

            // Verifica se o card está visível no viewport
            const isVisible = cardRight > scrollLeft && cardLeft < scrollLeft + containerWidth;

            if (isVisible && cardEl.style.visibility === 'hidden') {
                // Força a visibilidade e anima
                cardEl.style.visibility = 'visible';
                gsap.to(cardEl, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });
            }
        });
    };

    const handleNext = () => {
        // Se estiver em mobile, não executa a navegação pelas setas
        if (isMobile) return;
        if (isAnimating.current || !sliderMaskRef.current || !cardWidth) return;
        isAnimating.current = true;

        const { scrollLeft, offsetWidth } = sliderMaskRef.current;
        const totalContentWidth = sortedData.length * cardWidth;
        const maxScrollLeft = totalContentWidth - offsetWidth;
        let target: number;
        if (scrollLeft >= maxScrollLeft - 5) {
            target = 0;
        } else {
            target = Math.min(scrollLeft + offsetWidth, maxScrollLeft);
        }

        sliderMaskRef.current.scrollTo({
            left: target,
            behavior: "smooth",
        });

        // Aguarda o scroll terminar e verifica elementos visíveis
        const checkScrollEnd = () => {
            const currentScroll = sliderMaskRef.current?.scrollLeft;
            setTimeout(() => {
                if (sliderMaskRef.current?.scrollLeft === currentScroll) {
                    // Scroll terminou
                    checkVisibleElements();
                    ScrollTrigger.refresh();
                    isAnimating.current = false;
                } else {
                    checkScrollEnd();
                }
            }, 50);
        };
        checkScrollEnd();
    };

    const handlePrev = () => {
        // Se estiver em mobile, não executa a navegação pelas setas
        if (isMobile) return;
        if (isAnimating.current || !sliderMaskRef.current || !cardWidth) return;
        isAnimating.current = true;

        const { scrollLeft, offsetWidth } = sliderMaskRef.current;
        const totalContentWidth = sortedData.length * cardWidth;
        const maxScrollLeft = totalContentWidth - offsetWidth;
        let target: number;
        if (scrollLeft <= 5) {
            target = maxScrollLeft;
        } else {
            target = Math.max(scrollLeft - offsetWidth, 0);
        }

        sliderMaskRef.current.scrollTo({
            left: target,
            behavior: "smooth",
        });

        // Aguarda o scroll terminar e verifica elementos visíveis
        const checkScrollEnd = () => {
            const currentScroll = sliderMaskRef.current?.scrollLeft;
            setTimeout(() => {
                if (sliderMaskRef.current?.scrollLeft === currentScroll) {
                    // Scroll terminou
                    checkVisibleElements();
                    ScrollTrigger.refresh();
                    isAnimating.current = false;
                } else {
                    checkScrollEnd();
                }
            }, 50);
        };
        checkScrollEnd();
    };

    // registra o plugin apenas uma vez
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
    }, []);


    return (
        <section ref={sectionRef} className="max-w-full max-w-screen-2xl mx-auto">
            <div
                className="lolomoRow lolomoRow_title_card ltr-0 select-none"
                data-list-context="mostWatched"
            >
                <h2 className="rowHeader ltr-0 m-0">
          <span className="rowTitle ltr-0">
            <div className="px-5">
              <h1
                  className="text-primary font-bold 2xl:text-2xl md:text-xl text-lg"
              >
                Brinquedos: top 10 mais alugados
              </h1>
            </div>
          </span>
                </h2>

                <div className="rowContainer rowContainer_title_card transition-none" id="row-2">
                    <div className="ptrack-container">
                        <div className="rowContent slider-hover-trigger-layer">
                            <div className="slider 2xl:px-[4%] pl-5 ">
                                <div className="slider-wrapper">

                                    {/* Indicadores de paginação */}
                                    <ul className="pagination-indicator">
                                        {Array.from({ length: totalPages }).map((_, index) => (
                                            <li
                                                key={index}
                                                className={index === activePage ? "active" : ""}
                                                onClick={() => {
                                                    if (sliderMaskRef.current && cardWidth) {
                                                        const { offsetWidth } = sliderMaskRef.current;
                                                        const target = index * offsetWidth;
                                                        sliderMaskRef.current.scrollTo({
                                                            left: target,
                                                            behavior: "smooth",
                                                        });
                                                    }
                                                }}
                                                style={{ cursor: "pointer" }}
                                            />
                                        ))}
                                    </ul>

                                    {/* Container do slider com estilos para swipe */}
                                    <div
                                        ref={sliderMaskRef}
                                        className="sliderMask scrollbar-hide overflow-x-auto overflow-y-hidden py-6"
                                    >
                                        <div className="sliderContent row-with-x-columns">
                                            {sortedData.map((item, index) => (
                                                <div key={item.id} className={`slider-item slider-item-${index}`}>
                                                    <div className="title-card-container ltr-0">
                                                        <div id={`title-card-${index}`}
                                                             className="title-card title-card-top-10">
                                                            <div className="ptrack-content" data-tracking-uuid="...">
                                                                <a
                                                                    aria-label={item.title}
                                                                    tabIndex={0}
                                                                    aria-hidden="false"
                                                                    className="slider-refocus"
                                                                    onClick={e => {          // ① impede navegação
                                                                        e.preventDefault()
                                                                        handleOpenModal(index) // ② abre o Dialog
                                                                    }}
                                                                >


                                                                    <div
                                                                        className="boxart-container boxart-rounded boxart-size-7x10 group transition-all duration-300 ease-out transform-gpu hover:scale-105 hover:rotate-1 hover:z-10 flex">
                                                                        {/* Lado esquerdo – ranking */}
                                                                        <svg
                                                                            className="top-10-rank w-auto h-full select-none pointer-events-none flex-shrink-0 group transition-all duration-300 ease-out group-hover:scale-105 group-hover:rotate-5 group-hover:-translate-x-3 group-hover:z-10"
                                                                            viewBox={item.svgViewBox}
                                                                        >
                                                                            <path d={item.svgPath} stroke="#595959"
                                                                                  strokeWidth="4"/>
                                                                        </svg>

                                                                        {/* Lado direito – pôster + overlay + texto */}
                                                                        <div
                                                                            className="boxart-image-in-padded-container relative w-full group transition-all duration-300 ease-out transform-gpu group-hover:scale-105 group-hover:rotate-1 group-hover:shadow-2xl group-hover:z-10">
                                                                            {/* pôster */}
                                                                            <img
                                                                                src={item.imgSrc}
                                                                                alt={item.title}
                                                                                className="w-full h-full object-cover

                                                                                group-hover:saturate-125 group rounded-tr-sm rounded-br-sm"
                                                                            />

                                                                            {/* overlay de gradiente */}
                                                                            <div
                                                                                className="absolute bottom-0 right-0 h-full w-full z-10 pointer-events-none
                                                                                transition-opacity duration-300 group-hover:opacity-30
                                                                                after:absolute after:inset-0
                                                                                after:bg-gradient-to-t after:from-black/80 after:to-transparent

                                                                                after:z-0"
                                                                            />


                                                                            {/* texto sobreposto */}
                                                                            <div
                                                                                className="absolute right-0 bottom-0 w-full p-1 text-white z-10
                                                                                transition-transform duration-300 ease-in-out
                                                                                group-hover:translate-x-1 group-hover:-translate-y-1"
                                                                            >
                                                                                <p className="md:text-xs text-[7pt] font-bold truncate">
                                                                                    {`${index + 1}. ${item.title}`}
                                                                                </p>

                                                                                {item.desc && (
                                                                                    <p className="md:text-[7pt] text-[5pt] font-bold text-primary/70 truncate">
                                                                                        {item.desc}
                                                                                    </p>
                                                                                )}

                                                                                {item.rate !== undefined && (
                                                                                    <div
                                                                                        className="flex items-center gap-[2px] md:text-[7pt] text-[5pt] font-bold">
                                                                                        <StarRating value={item.rate}/>
                                                                                    </div>
                                                                                )}
                                                                            </div>

                                                                        </div>
                                                                    </div>

                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div className="bob-container"></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Renderiza as setas somente se NÃO for mobile */}
                                    {!isMobile && (
                                        <>
                                            <div
                                                className="handle handlePrev active p-5 lg:p-0"
                                                onClick={handlePrev}
                                                role="button"
                                                tabIndex={0}
                                            >
                      <span className="indicator-icon">
                        <FaChevronLeft/>
                      </span>
                                            </div>
                                            <div
                                                className="handle handleNext active p-5 lg:p-0"
                                                onClick={handleNext}
                                                role="button"
                                                tabIndex={0}
                                            >
                      <span className="indicator-icon">
                        <FaChevronRight />
                      </span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal para exibir a imagem do card */}
            {openModal && selectedIndex !== null && (
                <CarouselModal
                    open={openModal}
                    onOpenChange={setOpenModal}
                    items={sortedData.map(({ id, title, desc, imgSrc, rate, confeti }) => ({
                        id,
                        title,
                        desc,
                        imgSrc,
                        rate,
                        confeti,
                    }))}
                    initialIndex={selectedIndex}
                />

            )}
        </section>
    );
}