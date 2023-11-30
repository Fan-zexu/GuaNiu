import SafeWrapperHoc from "../../hoc/SafeWrapper";

const MockList = [
    {
        id: 1,
        data: {
            value: '数据1'
        }
    },
    {
        id: 2,
        data: {
            value: '数据2'
        }
    },
    {
        id: 3,
        data: null
    }
]

const Comp = ({data}: any) => ( <div> {data.value} </div>)

const SafeComp = SafeWrapperHoc(Comp);

const HandleError: React.FC = () => {
    return (
        <div>
            {
                MockList.map((item) => <SafeComp key={item.id} data={item.data} />)
            }
        </div>
    )
};

export default HandleError;