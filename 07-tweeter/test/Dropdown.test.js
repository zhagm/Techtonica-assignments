import Dropdown from "../src/components/Dropdown";

function createTestProps(props) {
  let usersArr = [
    { name: "User1", id: "1" },
    { name: "User2", id: "2" },
    { name: "User3", id: "3" },
    { name: "User4", id: "4" },
    { name: "User5", id: "5" }
  ];
  return {
    activeUserId: "1",
    selectUser: () => {},
    allUsers: usersArr,
    ...props
  };
}

let wrapper;

beforeEach(() => {
  let props = createTestProps();
  wrapper = shallow(
    <Dropdown
      allUsers={props.allUsers}
      selectUser={props.selectUser}
      activeUserId={props.activeUserId}
    />
  );
});

describe("<Dropdown /> rendering", () => {
  it("should render one <select>", () => {
    expect(wrapper.find("select")).toHaveLength(1);
  });

  it("should render the amount of options that are passed in as items", () => {
    expect(wrapper.find("option")).toHaveLength(5);
  });
});
