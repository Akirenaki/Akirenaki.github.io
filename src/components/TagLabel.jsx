// A tag's English label, followed by the term in its source language when the
// taxonomy has one: Dependent origination (Pratītyasamutpāda). The original is
// italic and carries its own lang attribute so screen readers pronounce it
// properly. Arabic script stays upright: a synthetic slant distorts it.
const ARABIC_SCRIPT = /[\u0600-\u06FF]/;

export function TagLabel({ tag }) {
  return (
    <>
      {tag.label}
      {tag.original && (
        <>
          {" "}
          (
          <span lang={tag.originalLang} className={ARABIC_SCRIPT.test(tag.original) ? "" : "italic"}>
            {tag.original}
          </span>
          )
        </>
      )}
    </>
  );
}
