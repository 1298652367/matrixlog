import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import type { UploadProps } from 'antd';
import { log_analysis } from '../../utils/api';
import { message, Upload, Col, Row, Table, Collapse } from 'antd';
const { Column, ColumnGroup } = Table;

import './index.scss'

type Result = {
    [key: string]: FinalResult
};
type FinalResult = {
    [key: string]: OptModul
};
type OptModul = {
    [key: string]: Operation[]
}
type Operation = {
    Operation: string;
    Timestamp: string;
    Param: string;
};

interface PlayerInstance {
    instance_id: string;
    start_time: string;
    end_time: string;
}

type InstanceModule = {
    [key: string]: string[];
}
type CurrentModul = Record<string, string[]>;

type CurrentViewModul = {
    key: string,
    label: string,
    children: string,
}[];

const { Dragger } = Upload;


const Home: React.FC = () => {
    

    const styles = {
        color: 'lightgrey',
        fontSize: '15px',
    };
   

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        // action: 'http://172.21.240.26:9999/logmatrix/upload_logfile',
        action: "/api/logmatrix/upload_logfile",
        maxCount: 1,

        onChange(info) {

            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file);
            }
            if (status === 'done') {
                message.success(`file uploaded successfully.`);
                analysisLog(info.file as any)

            } else if (status === 'error') {
                message.error(`file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const fun = (value: CurrentModul) => {
        const output: CurrentViewModul = [];
        Object.keys(value).forEach((k, i) => {
            output.push({
                key: (i + 1).toString(),
                label: k,
                children: value[k].join('-'),
            })
        })
        return output
    }



    const [playerInstances,setPlayerInstances] = useState<PlayerInstance[]>([]);
    const [items , setItems] = useState<CollapseProps['items']>([])
    const analysisLog = async (file: File) => {
        let currentModules: CurrentModul = {}
        const response = await log_analysis(file);
        let strres = response.data.result;

        let res: Result = eval("(" + strres + ")");

        let instanceModules: InstanceModule[] = [];

        Object.keys(res).forEach((k1) => {
            let finalResult: FinalResult = res[k1]
            let playerInstance: PlayerInstance = { instance_id: k1, start_time: '空', end_time: '空' };
            if (instanceModules[parseInt(k1)] === undefined) {
                instanceModules[parseInt(k1)] = {};
            }
            let instanceModule: InstanceModule = instanceModules[parseInt(k1)]

            Object.keys(finalResult).forEach((k2) => {
                let optModul: OptModul = finalResult[k2]

                Object.keys(optModul).forEach((k3) => {
                    let operations: Operation[] = optModul[k3]

                    if (instanceModule[k3] !== undefined) {
                        instanceModule[k3] = []
                    }
                    // debugger
                    operations.forEach((value) => {
                        if (value.Operation === 'Construct') {
                            playerInstance.start_time = value.Timestamp
                        } else if (value.Operation === 'Destroy') {
                            playerInstance.end_time = value.Timestamp
                        }
                        if (instanceModule[k3] !== undefined) {
                            instanceModule[k3].push(value.Timestamp + ' ' + value.Operation + ' ' + value.Param)
                        } else {
                            instanceModule[k3] = [value.Timestamp + ' ' + value.Operation + ' ' + value.Param]
                        }
                    })
                })

            })
            if (playerInstances !== undefined) {
                playerInstances.push(playerInstance)
            } else {
                setPlayerInstances([playerInstance])
            }

        })
    
        currentModules = instanceModules[parseInt(playerInstances[0].instance_id)];

        let ans: CurrentViewModul = fun(currentModules)

        setPlayerInstances([...playerInstances])
        setItems([...ans])
    };



    return (
        <>
            <Dragger {...props} >
                <p className="ant-upload-drag-icon" >
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                </p>
            </Dragger>
            <div>
                <span style={styles}>将日志上传, 等待解析结果即可</span>
            </div>
            <br />
            <Row>
                <Col flex={10}>
                    <Table dataSource={playerInstances}>
                        <ColumnGroup title="日志">
                            <Column title="实例Id" dataIndex="instance_id" key="instance_id" />
                            <Column title="开始时间" dataIndex="start_time" key="start_time" />
                            <Column title="结束时间" dataIndex="end_time" key="end_time" />
                        </ColumnGroup>
                    </Table>

                </Col>
                <Col flex={2}>
                </Col>
                <Col flex={12}>

                    <Collapse items={items} defaultActiveKey={['1']}  >
                    </Collapse>

                </Col>
            </Row>
        </>
    )
};
export default Home