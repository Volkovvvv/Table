import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Popconfirm, Space, Row, Col } from 'antd';
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';

const CustomTable = () => {
  
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const showAddModal = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
    form.resetFields();
  };

  const showEditModal = (record) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
    form.setFieldsValue(record);
  };

  const deleteRecord = (key) => {
    setRecords(records.filter((item) => item.key !== key));
  };

  const handleModalSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (selectedRecord) {
          setRecords((prevRecords) =>
            prevRecords.map((item) =>
              item.key === selectedRecord.key ? { ...item, ...values } : item
            )
          );
        } else {
          setRecords((prevRecords) => [
            ...prevRecords,
            { key: Date.now(), ...values },
          ]);
        }
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.log('Ошибка:', error);
      });
  };

  const columns = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 10 }}>
          <Input
            placeholder="Поиск по имени"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={confirm}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={confirm}
              size="small"
              style={{ width: 100 }}
            >
              Найти
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 100 }}>
              Очистить
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Возраст',
      dataIndex: 'age',
      key: 'age',
      sorter: (a, b) => a.age - b.age,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 10 }}>
          <InputNumber
            placeholder="Поиск по возрасту"
            value={selectedKeys[0]}
            onChange={(value) => setSelectedKeys(value ? [String(value)] : [])}
            onPressEnter={confirm}
            style={{ marginBottom: 8, width: '100%' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={confirm}
              size="small"
              style={{ width: 100 }}
            >
              Найти
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 100 }}>
              Очистить
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) => record.age.toString().includes(value),
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          <Popconfirm
            title="Удалить запись?"
            onConfirm={() => deleteRecord(record.key)}
            okText="Да"
            cancelText="Нет"
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 15 }}>
        <Col>
          <Button
            type="primary"
            onClick={showAddModal}
            icon={<PlusCircleOutlined />}
          >
            Добавить запись
          </Button>
        </Col>
      </Row>
      <Table
        dataSource={records}
        columns={columns}
        rowKey="key"
        pagination={{ pageSize: 5 }}
      />
      <Modal
        title={selectedRecord ? 'Редактирование' : 'Добавление новой записи'}
        visible={isModalOpen}
        onOk={handleModalSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Введите имя' }]}
          >
            <Input placeholder="Введите полное имя" />
          </Form.Item>
          <Form.Item
            name="age"
            label="Возраст"
            rules={[{ required: true, message: 'Введите возраст' }]}
          >
            <InputNumber min={1} max={100} style={{ width: '100%' }} placeholder="Введите возраст" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomTable;
