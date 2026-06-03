"use client";

type Props = {
    name: string
    age: number
    bio: string
    rating: number
    birthDate: string
}

export function FormPreview({ name, age, bio, rating, birthDate }: Props){
    return (
        <div>
            <p> {name ? name : "Brak imienia"} </p>
            <p> {age ? age : "Brak wieku"} </p>
            <p> {bio ? bio : "Brak biografii"} </p>
            <p> {rating ? rating : "Brak ratingu"}</p>
            <p> {birthDate ? birthDate : "Brak daty"} </p>
        </div>
    )
}