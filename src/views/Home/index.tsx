import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { CollapseProps } from 'antd';
import type { UploadProps } from 'antd';
import { log_analysis } from '../../utils/api';
import { message, Upload, Col, Row, Table, Collapse } from 'antd';
const { Column, ColumnGroup } = Table;

import './index.scss'

interface Operation {
    Operation: string;
    Timestamp: string;
    Param: string;
}

interface PlayerInstance {
    instance_id: string;
    start_time: string;
    end_time: string;
}

interface InstanceModule {
    [key: string]: Operation[];
}
type CurrentModul = Record<string, string[]>;

type CurrentViewModul = {
    key: string,
    label: string,
    children: string,
}[];

const { Dragger } = Upload;
let items: CollapseProps['items']=[]

const Home: React.FC = () => {
    const styles = {
        color: 'lightgrey',
        fontSize: '15px',
    };
    const onChange = (key: string | string[]) => {
        console.log(key);
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
    const [playerInstances, setPlayerInstances] = useState<PlayerInstance[]>([]);
    const [currentModules, setCurrentModules] = useState<CurrentModul[]>([]);

    const analysisLog = async (file: File) => {
        let currentModules: CurrentModul = {}
        const response = await log_analysis(file);
        let strres = response.data.result;
        
        let res = eval("(" + strres + ")");
        let ids = Object.keys(res);
        let playerInstances: PlayerInstance[] = [];
        let instanceModules: InstanceModule[] = [];
        let id: string

        for (id of ids) {
            let finalResult = res[id].FinalResult;
            if (finalResult === undefined) {
                continue;
            }
            let modules = Object.keys(finalResult);

            if (instanceModules[parseInt(id)] === undefined) {

                instanceModules[parseInt(id)] = {};
            }
            let playerInstance: PlayerInstance = { instance_id: id, start_time: '空', end_time: '空' };
            let instanceModule = instanceModules[parseInt(id)];
            for (let module of modules) {
                let operations = res[id].FinalResult[module];
                if (instanceModule[module] === undefined) {
                    instanceModule[module] = [];
                }
                let moduleOps = instanceModule[module];
                for (let operation of operations) {
                    if (operation.Operation === 'Construct') {
                        playerInstance.start_time = operation.Timestamp;
                    }
                    if (operation.Operation === 'Destroy') {
                        playerInstance.end_time = operation.Timestamp;
                    }
                    moduleOps.push(operation.Timestamp + ' ' + operation.Operation + ' ' + operation.Param);
                }
            }
            playerInstances.push(playerInstance);
        }
        currentModules = instanceModules[playerInstances[0].instance_id];

        setPlayerInstances(playerInstances);
        setCurrentModules(currentModules);

        currentModules = fun(currentModules)
        console.log(currentModules)
        items = currentModules;
       
    
    };

    
    const fun = (value: CurrentModul) => {
        const output: CurrentViewModul = [];
        Object.keys(value).forEach((k, i) => {
            output.push({
                key: (i+1).toString(),
                label: k,
                children: value[k].join('-'),
            })
        })
        return output
    }

   
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
                    
                    <Collapse items={items} defaultActiveKey={['1']} onChange={onChange} >
                        </Collapse>
                    
                </Col>
            </Row>
        </>
    )
};
export default Home