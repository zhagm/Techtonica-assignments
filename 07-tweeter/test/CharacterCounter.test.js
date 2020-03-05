import CharacterCounter from "../src/components/CharacterCounter";

describe("<CharacterCounter /> rendering", () => {
  it("should render one <p>", () => {
    let wrapper = mount(<CharacterCounter />);
    expect(wrapper.children("p")).toHaveLength(1);
  });

  it("should render characters remaining given count and max", () => {
    let wrapper = mount(<CharacterCounter max={100} chars={1} />);
    expect(wrapper.text()).toEqual("99 characters remaining");
  });

  it("should render negative characters remaining if count exceeds max", () => {
    let wrapper = mount(<CharacterCounter max={100} chars={101} />);
    expect(wrapper.text()).toEqual("-1 characters remaining");
  });

  it("should render without an error and default to zero if no props are passed", () => {
    let wrapper = mount(<CharacterCounter />);
    expect(wrapper.text()).toEqual("0 characters remaining");
  });

  // add test to check color?
});
