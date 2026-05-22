"use client";
import ClubCarousel from "@/components/ui/ClubCarousel";
import { useForm, useStore } from "@tanstack/react-form";
import { useEffect } from "react";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Imię musi mieć przynajmniej 2 znaki"),
  password: z.string().min(8, "Hasło musi mieć przynajmniej 8 znakow"),
});

const STORAGE_KEY = "form-learn";

export default function Page() {
  const form = useForm({
    defaultValues: {
      name: "",
      password: "",
      option: "" as "A" | "B" | "C" | "D" | "",
      color: "",
      extraText: "",
    },
    listeners: {
      onChange: ({ formApi }) => {
        try {
          const { name, password, option } = formApi.state.values;
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ name, password, option }),
          );
        } catch {}
      },
    },
    onSubmit: async ({ value }) => {
      const parsed = schema.safeParse(value);
      if (!parsed.success) return;

      const res = await fetch("http://localhost:3001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(value),
      });

      const data = await res.json();
      console.log(data);

      localStorage.removeItem(STORAGE_KEY);
      form.reset();
    },
  });

  const selectedOption = useStore(form.store, (state) => state.values.option);

  useEffect(() => {
    if (selectedOption === "C") {
      const timer = setTimeout(() => {
        form.setFieldValue("option", "A");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedOption]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed = JSON.parse(saved);
      if (typeof parsed !== "object" || parsed === null) return;
      form.setFieldValue(
        "name",
        typeof parsed.name === "string" ? parsed.name : "",
      );
      form.setFieldValue(
        "password",
        typeof parsed.password === "string" ? parsed.password : "",
      );
      form.setFieldValue("option", parsed.option);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);
  const extraText = useStore(form.store, (state) => state.values.extraText);

  useEffect(() => {
    if (selectedOption !== "D") return;
    form.setFieldValue("name", extraText);
  }, [extraText, selectedOption]);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-lg">
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
            children={(field) => (
              <div className="form-field">
                <input
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
          />

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
            children={(field) => (
              <div className="form-field">
                <input
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
          />

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

          <button className="form-submit" type="submit">
            Zarejestruj
          </button>
        </form>
      </div>
      <ClubCarousel />
    </div>
  );
}
