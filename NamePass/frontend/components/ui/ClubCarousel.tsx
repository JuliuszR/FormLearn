"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  initialIndex: number;
  onIndexChange: (index: number) => void;
};

const CLUBS = [
  {
    id: 1,
    name: "Legia",
    city: "Warszawa",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/fa/Legia_Warszawa.png",
  },
  {
    id: 2,
    name: "Lech",
    city: "Poznań",
    image:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/KKS_Lech_Poznań.svg/250px-KKS_Lech_Poznań.svg.png",
  },
  {
    id: 3,
    name: "Widzew",
    city: "Łódź",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/f/fd/Herb_Widzew_Łódź.png",
  },
  {
    id: 4,
    name: "Pogoń",
    city: "Szczecin",
    image: "https://sklep.pogonszczecin.pl/img/logo-1722321605.jpg",
  },
];

const CAROUSEL_KEY = "carousel-index";

export default function ClubCarousel({ initialIndex, onIndexChange }: Props) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    api.scrollTo(initialIndex);
  }, [api, initialIndex]);

  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrent(index);
      onIndexChange(index); 
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  return (
    <div className="w-full px-8 py-4">
      <Carousel setApi={setApi} opts={{ loop: false }} className="w-full">
        <CarouselContent>
          {CLUBS.map((club) => (
            <CarouselItem key={club.id} className="basis-1/2 sm:basis-1/3">
              <Card className="overflow-hidden">
                <CardContent className="flex flex-col items-center gap-2 p-4">
                  <img
                    src={club.image}
                    alt={club.name}
                    className="h-16 w-16 object-contain"
                    draggable={false}
                  />
                  <p className="text-sm font-medium">{club.name}</p>
                  <p className="text-muted-foreground text-xs">{club.city}</p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
