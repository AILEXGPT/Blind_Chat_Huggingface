import classNames from "classnames";
import { createBreakpoint } from "react-use";
import { AnimatePresence } from "framer-motion";
import InfiniteScroll from "react-infinite-scroller";

import { Image } from "@/utils/type";
import { useCollections } from "@/components/main/hooks/useCollections";
import { Modal } from "@/components/modal/modal";
import { Collection } from "./collection";
import { CollectionLoading } from "./loading";
import { useCollection } from "@/components/modal/useCollection";

const useBreakpoint = createBreakpoint({ XL: 1280, L: 1024, S: 768, XS: 640 });

export const Collections: React.FC<{ category: string }> = ({ category }) => {
  const { open, setOpen } = useCollection();
  const { images, loading, infiniteRefetch, pagination, infiniteLoading } =
    useCollections(category);
  const breakpoint = useBreakpoint();

  if (loading) return null;

  return (
    <>
      <InfiniteScroll
        pageStart={0}
        getScrollParent={() => document.getElementById("content")}
        loadMore={() => {
          if (infiniteLoading) return;
          infiniteRefetch();
        }}
        useWindow={false}
        hasMore={pagination?.total_pages > pagination?.page}
        className="mx-auto grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-8 lg:mt-14"
      >
        {images?.map((collection: Image, i: number) =>
          collection?.loading ? (
            <CollectionLoading
              key={"loading" + collection.id}
              prompt={collection.prompt}
              error={collection.error}
              className={classNames("", {
                "!translate-y-12":
                  breakpoint === "XL"
                    ? i % 5 === 1 || i % 5 === 3
                    : breakpoint === "L"
                    ? i % 4 === 1 || i % 4 === 3
                    : breakpoint === "S"
                    ? i % 3 === 1
                    : breakpoint === "XS"
                    ? false
                    : false,
              })}
            />
          ) : (
            <Collection
              key={category + collection.id}
              index={i}
              category={category}
              collection={collection}
              className={classNames("", {
                "!translate-y-12":
                  breakpoint === "XL"
                    ? i % 5 === 1 || i % 5 === 3
                    : breakpoint === "L"
                    ? i % 4 === 1 || i % 4 === 3
                    : breakpoint === "S"
                    ? i % 3 === 1
                    : breakpoint === "XS"
                    ? false
                    : false,
              })}
              onOpen={setOpen}
            />
          )
        )}
      </InfiniteScroll>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {open !== null && <Modal id={open} onClose={() => setOpen(null)} />}
      </AnimatePresence>
    </>
  );
};
