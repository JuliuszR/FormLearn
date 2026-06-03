"use client";
import ClubCarousel from "@/components/ui/ClubCarousel";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { useSession } from "@/lib/useSession";
import { FormPreview } from "@/components/ui/FormPreview";

const scrollToField = (ref: React.RefObject<HTMLElement | null>) => {
  ref.current?.focus();
  ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
};

const schema = z.object({
  name: z.string().min(2, "Imię musi mieć przynajmniej 2 znaki"),
  password: z.string().min(8, "Hasło musi mieć przynajmniej 8 znakow"),
});

const STORAGE_KEY = "form-learn";

export default function Page() {
  const { initialData, save } = useSession();
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const form = useForm({
    defaultValues: {
      name: "",
      password: "",
      option: "" as "A" | "B" | "C" | "D" | "",
      color: "",
      extraText: "",
      age: 0,
      birthDate: "",
      phone: "",
      agreed: false,
      rating: 0,
      bio: "",
    },
    listeners: {
      onBlur: ({ formApi }) => {
        const v = formApi.state.values;
        save({
          name: v.name,
          password: v.password,
          option: v.option,
          color: v.color,
          extraText: v.extraText,
          age: v.age,
          birthDate: v.birthDate,
          phone: v.phone,
          agreed: v.agreed,
          rating: v.rating,
          bio: v.bio,
          carouselIndex: 0,
        });
      },
    },
    onSubmit: async ({ value }) => {
      setSubmitStatus("idle");
      const parsed = schema.safeParse(value);
      if (!parsed.success) return;

      try {
        const res = await fetch("http://localhost:3001/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });
        if (!res.ok) throw new Error();
        form.reset();
        setSubmitStatus("success");
      } catch {
        setSubmitStatus("error");
      }
    },
  });

  const selectedOption = useStore(form.store, (state) => state.values.option);
  const extraText = useStore(form.store, (state) => state.values.extraText);
  const pass = useStore(form.store, (state) => state.values.password);
  const bio = useStore(form.store, (state) => state.values.bio);
  const agreed = useStore(form.store, (state) => state.values.agreed);
  const phone = useStore(form.store, (state) => state.values.phone);
  const name = useStore(form.store, (state) => state.values.name);
  const age = useStore(form.store, (state) => state.values.age);
  const rating = useStore(form.store, (state) => state.values.rating);
  const birthDate = useStore(form.store, (state) => state.values.birthDate);

  const nameRef = useRef<HTMLInputElement>(null);
  const passRef = useRef<HTMLInputElement>(null);
  const ageRef = useRef<HTMLInputElement>(null);
  const birthRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const agreedRef = useRef<HTMLDivElement>(null);
  const ratingRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedOption === "C") {
      const timer = setTimeout(() => {
        form.setFieldValue("option", "A");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (!initialData) return;
    form.setFieldValue("name", initialData.name);
    form.setFieldValue("password", initialData.password);
    form.setFieldValue(
      "option",
      initialData.option as "A" | "B" | "C" | "D" | "",
    );
    form.setFieldValue("color", initialData.color);
    form.setFieldValue("extraText", initialData.extraText);
    form.setFieldValue("age", initialData.age);
    form.setFieldValue("birthDate", initialData.birthDate);
    form.setFieldValue("phone", initialData.phone);
    form.setFieldValue("agreed", initialData.agreed);
    form.setFieldValue("rating", initialData.rating);
    form.setFieldValue("bio", initialData.bio);
  }, [initialData]);

  useEffect(() => {
    if (selectedOption !== "D") return;
    form.setFieldValue("name", extraText);
  }, [extraText, selectedOption]);

  return (
    <div className="flex gap-8 items-start w-full max-w-5xl">
      <div className="flex flex-col gap-6 flex-1 min-w-0">
      <div className="form-card w-full">
        <h1 className="form-title">Utwórz konto</h1>
        <p className="form-subtitle">
          Wypełnij formularz, aby się zarejestrować
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="name"
            validators={{
              onBlur: ({ value }) =>
                value.length < 2 ? "Min 2 znaki" : undefined,
            }}
          >
            {(field) => (
              <div className="form-field">
                <label className="form-label">Imię</label>
                <input
                  ref={nameRef}
                  className="form-input"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Imię"
                />
                {field.state.meta.errors[0] && (
                  <p className="field-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) => {
                if (value.length < 8) return "Min 8 znakow";
                if (!/\d/.test(value))
                  return "Hasło musi zawierać co najmniej jedną cyfrę";
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="form-field">
                <label className="form-label">Hasło</label>
                <input
                  ref={passRef}
                  className="form-input"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Hasło"
                  type="password"
                />
                {field.state.meta.errors[0] && (
                  <p className="field-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="age"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Wiek jest wymagany";
                if (value < 1 || value > 120)
                  return "Wiek musi być między 1 a 120";
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="form-field">
                <label className="form-label">Wiek</label>
                <input
                  ref={ageRef}
                  className="form-input"
                  type="number"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  onBlur={field.handleBlur}
                  placeholder="25"
                  min={1}
                  max={120}
                />
                {field.state.meta.errors[0] && (
                  <p className="field-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="birthDate"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Data urodzenia jest wymagana";
                const date = new Date(value);
                const today = new Date();
                if (date >= today) return "Data musi być w przeszłości";
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="form-field">
                <label className="form-label">Data urodzenia</label>
                <input
                  ref={birthRef}
                  className="form-input"
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
                {field.state.meta.errors[0] && (
                  <p className="field-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="phone"
            validators={{
              onBlur: ({ value }) => {
                if (!value) return "Numer telefonu jest wymagany";
                if (!/^\+?[\d\s\-]{9,15}$/.test(value)) {
                  return "Nieprawidłowy numer telefonu";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="form-field">
                <label className="form-label">Telefon</label>
                <input
                  ref={phoneRef}
                  className="form-input"
                  type="tel"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="+48 123 456 789"
                />
                {field.state.meta.errors[0] && (
                  <p className="field-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="rating"
            validators={{
              onChange: ({ value }) =>
                value === 0 ? "Wybierz ocenę" : undefined,
            }}
          >
            {(field) => (
              <div className="form-field">
                <label className="form-label">Ocena</label>
                <div
                  ref={ratingRef}
                  style={{ display: "flex", gap: "4px", fontSize: "1.5rem" }}
                >
                  {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                    <span
                      key={star}
                      onClick={() => field.handleChange(star)}
                      style={{
                        cursor: "pointer",
                        color: star <= field.state.value ? "yellow" : "gray",
                      }}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {field.state.meta.errors[0] && (
                  <p className="field-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="bio"
            validators={{
              onChange: ({ value }) => {
                if (value.length > 200) return "Maksymalnie 200 znaków";
                return undefined;
              },
              onBlur: ({ value }) => {
                if (value.length < 10)
                  return "Bio musi mieć co najmniej 10 znaków";
                return undefined;
              },
            }}
          >
            {(field) => (
              <div className="form-field">
                <label className="form-label">
                  Bio
                  <span
                    style={{
                      float: "right",
                      color: bio.length > 200 ? "red" : "#64748b",
                      fontSize: "0.8rem",
                    }}
                  >
                    {bio.length}/200
                  </span>
                </label>
                <textarea
                  ref={bioRef}
                  className="form-input"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="Napisz coś o sobie..."
                  maxLength={200}
                  rows={3}
                  style={{ resize: "vertical" }}
                />
                {field.state.meta.errors[0] && (
                  <p className="field-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field
            name="agreed"
            validators={{
              onChange: ({ value }) =>
                !value ? "Musisz zaakceptować regulamin" : undefined,
            }}
          >
            {(field) => (
              <div
                ref={agreedRef}
                className="form-field"
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <input
                  type="checkbox"
                  id="agreed"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                  onBlur={field.handleBlur}
                />
                <label
                  className="form-label"
                  htmlFor="agreed"
                  style={{ margin: 0 }}
                >
                  Akceptuję regulamin
                </label>
                {field.state.meta.errors[0] && (
                  <p className="field-error">{field.state.meta.errors[0]}</p>
                )}
              </div>
            )}
          </form.Field>

          <form.Field name="option">
            {(field) => (
              <div className="form-field">
                <label className="form-label" htmlFor="option">
                  Wybierz opcję
                </label>
                <select
                  id="option"
                  className="form-input"
                  value={field.state.value}
                  onChange={(e) =>
                    field.handleChange(
                      e.target.value as "A" | "B" | "C" | "D" | "",
                    )
                  }
                >
                  <option value="">-- wybierz --</option>
                  <option value="A">Opcja A</option>
                  <option value="B">Opcja B</option>
                  <option value="C">Opcja C</option>
                  <option value="D">Opcja D</option>
                </select>

                {selectedOption === "A" && (
                  <p style={{ color: "green" }}>Wybrano opcję A</p>
                )}

                {selectedOption === "B" && (
                  <form.Field name="color">
                    {(colorField) => (
                      <div className="form-field">
                        <label className="form-label">Wybierz kolor</label>
                        <select
                          className="form-input"
                          value={colorField.state.value}
                          onChange={(e) =>
                            colorField.handleChange(e.target.value)
                          }
                        >
                          <option value="">-- wybierz kolor --</option>
                          <option value="red">Czerwony</option>
                          <option value="green">Zielony</option>
                          <option value="blue">Niebieski</option>
                        </select>
                      </div>
                    )}
                  </form.Field>
                )}

                {selectedOption === "C" && (
                  <p style={{ color: "orange" }}>
                    Opcja C jest aktywna — opcja A zostanie zaznaczona za chwilę
                  </p>
                )}

                {selectedOption === "D" && (
                  <form.Field name="extraText">
                    {(extraField) => (
                      <div className="form-field">
                        <label className="form-label" htmlFor="extraText">
                          Dodatkowe pole
                        </label>
                        <input
                          id="extraText"
                          className="form-input"
                          value={extraField.state.value}
                          onChange={(e) =>
                            extraField.handleChange(e.target.value)
                          }
                          placeholder="Wpisz cokolwiek..."
                        />
                      </div>
                    )}
                  </form.Field>
                )}
              </div>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => state.isSubmitting}>
            {(isSubmitting) => (
              <button
                className="form-submit"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Rejestrowanie..." : "Zarejestruj"}
              </button>
            )}
          </form.Subscribe>
          <div style={{ marginTop: "0.5rem" }}>
            {!name && (
              <button
                type="button"
                onClick={() => scrollToField(nameRef)}
                style={{
                  display: "block",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Uzupełnij imię
              </button>
            )}

            {!pass && (
              <button
                type="button"
                onClick={() => scrollToField(passRef)}
                style={{
                  display: "block",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Uzupełnij hasło
              </button>
            )}

            {!age && (
              <button
                type="button"
                onClick={() => scrollToField(ageRef)}
                style={{
                  display: "block",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Uzupełnij wiek
              </button>
            )}
            {!birthDate && (
              <button
                type="button"
                onClick={() => scrollToField(birthRef)}
                style={{
                  display: "block",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Uzupełnij date urodzenia
              </button>
            )}
            {!phone && (
              <button
                type="button"
                onClick={() => scrollToField(phoneRef)}
                style={{
                  display: "block",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Uzupełnij telefon
              </button>
            )}
            {!agreed && (
              <button
                type="button"
                onClick={() => scrollToField(agreedRef)}
                style={{
                  display: "block",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Uzupełnij zgode
              </button>
            )}
            {!rating && (
              <button
                type="button"
                onClick={() => scrollToField(ratingRef)}
                style={{
                  display: "block",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Uzupełnij rating
              </button>
            )}
            {!bio && (
              <button
                type="button"
                onClick={() => scrollToField(bioRef)}
                style={{
                  display: "block",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Uzupełnij bio
              </button>
            )}
          </div>
          {submitStatus === "success" && (
            <p style={{ color: "green", marginTop: "0.5rem" }}>
              Zarejestrowano pomyślnie!
            </p>
          )}
          {submitStatus === "error" && (
            <p style={{ color: "red", marginTop: "0.5rem" }}>
              Błąd rejestracji. Spróbuj ponownie.
            </p>
          )}
        </form>
      </div>

      <ClubCarousel
        initialIndex={initialData?.carouselIndex ?? 0}
        onIndexChange={(index) => {
          const v = form.state.values;
          save({
            name: v.name,
            password: v.password,
            option: v.option,
            color: v.color,
            extraText: v.extraText,
            age: v.age,
            birthDate: v.birthDate,
            phone: v.phone,
            agreed: v.agreed,
            rating: v.rating,
            bio: v.bio,
            carouselIndex: index,
          });
        }}
      />
      </div>

      <div className="sticky top-6 w-80 shrink-0">
        <FormPreview
          name={name}
          age={age}
          bio={bio}
          rating={rating}
          birthDate={birthDate}
        />
      </div>
    </div>
  );
}
