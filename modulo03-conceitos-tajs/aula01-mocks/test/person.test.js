import { describe, it, expect, jest } from "@jest/globals";
import Person from "../src/person";

describe("#Person Suite", () => {
  describe("#validate", () => {
    it("Should throw if the name is not present", () => {
      const mockInvalidPerson = {
        name: "",
        cpf: "123.123.123-00",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        "Name is required."
      );
    });

    it("Should throw if the CPF is not present", () => {
      const mockInvalidPerson = {
        name: "João",
        cpf: "",
      };

      expect(() => Person.validate(mockInvalidPerson)).toThrow(
        "CPF is required."
      );
    });
  });
  jest;

  describe("#format", () => {
    it("Should format the person name and CPF", () => {
      const mockPerson = {
        name: "Gustavo Henrique Coimbra Galo",
        cpf: "452.271.808-06",
      };

      const expected = {
        name: "Gustavo",
        cpf: "45227180806",
        lastName: "Henrique Coimbra Galo",
      };

      expect(Person.format(mockPerson)).toStrictEqual(expected);
    });
  });

  describe("#save", () => {
    // it("Should save person");
  });

  describe("#process", () => {
    it("Should process a valid person", () => {
      const mockPerson = {
        name: "Zé da Silva",
        cpf: "123.456.789-00",
      };

      jest.spyOn(Person, Person.validate.name).mockReturnValue();

      jest.spyOn(Person, Person.format.name).mockReturnValue({
        name: "Zé",
        lastName: "da Silva",
        cpf: "12345678900",
      });

      const expected = "ok";
      expect(Person.process(mockPerson)).toStrictEqual(expected);
    });
  });
});
