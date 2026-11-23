import { afterEach, describe, expect, it, vi } from "vitest";
import { formatarData, formatarDataHora, hojeIso, linkSite, linkWhatsapp } from "@/lib/format";

describe("formatarData", () => {
  it("converte a data ISO do backend para dd/mm/aaaa sem deslocar o fuso", () => {
    expect(formatarData("2026-01-01")).toBe("01/01/2026");
    expect(formatarData("2026-12-31T23:59:00")).toBe("31/12/2026");
  });

  it("devolve texto vazio quando não há data", () => {
    expect(formatarData(null)).toBe("");
    expect(formatarData(undefined)).toBe("");
    expect(formatarDataHora("")).toBe("");
  });
});

describe("linkWhatsapp", () => {
  it("monta o link do wa.me com DDI 55", () => {
    expect(linkWhatsapp("(31) 99999-8888")).toBe("https://wa.me/5531999998888");
    expect(linkWhatsapp("5519999999999")).toBe("https://wa.me/5519999999999");
  });

  it("recusa telefones incompletos", () => {
    expect(linkWhatsapp("9999-8888")).toBeNull();
  });
});

describe("linkSite", () => {
  it("adiciona https só quando o protocolo está faltando", () => {
    expect(linkSite("pizzaria.com")).toBe("https://pizzaria.com");
    expect(linkSite("http://pizzaria.com")).toBe("http://pizzaria.com");
  });
});

describe("hojeIso", () => {
  afterEach(() => vi.useRealTimers());

  it("usa a data local no formato aaaa-mm-dd", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 2, 5, 23, 30));
    expect(hojeIso()).toBe("2026-03-05");
  });
});
