import { Button, Form, Input, List, Modal, Select, Space } from "antd";
import { ChangeEvent, FC, useState } from "react";
import styled from "./CreateModal.module.css";
import {
  TaskType,
  updateProjectsType,
  WorkersType,
} from "../../pages/MainPage/MainPage";

interface CreateModalProps {
  isOpen: boolean;
  workers: WorkersType[];
  handleCloseModal: (value: boolean) => void;
  updateProjects: updateProjectsType;
}

const CreateModal: FC<CreateModalProps> = ({
  workers,
  isOpen,
  handleCloseModal,
  updateProjects,
}) => {
  const [projectNameTitle, setProjectNameTitle] = useState("");
  const [projectWorkerIds, setProjectWorkerIds] = useState<string[]>([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [projectTasks, setProjectTasks] = useState<TaskType[]>([]);

  const handleTaskTitle = (event: ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(event.target.value);
  };

  const handleChangeProjectName = (e: ChangeEvent<HTMLInputElement>) => {
    setProjectNameTitle(e.target.value);
  };

  const handleChangeWorkersSelect = (value: string[]) => {
    setProjectWorkerIds(value);
  };

  const handleCloseButton = () => {
    handleCloseModal(false);
    setProjectNameTitle("");
    setTaskTitle("");
    setProjectWorkerIds([]);
    setProjectTasks([]);
  };

  type handleCreateProjectButton = (
    name: string,
    workerIds: string[],
    tasks: TaskType[]
  ) => void;

  const handleCreateProjectButton: handleCreateProjectButton = (
    name,
    workerIds,
    tasks
  ) => {
    if (!name || !workerIds.length || !tasks.length) {
      alert("Заполните пустые поля");
      return;
    }

    const project = {
      id: String(Math.random()),
      headWorkerId: "1",
      name: name.trim(),
      workerIds,
      tasks,
    };

    fetch("http://localhost:3000/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    })
      .then((response) => response.json())
      .then((project) => updateProjects(project, "post"));

    handleCloseModal(false);
    handleCloseModal(false);
    setProjectNameTitle("");
    setTaskTitle("");
    setProjectWorkerIds([]);
    setProjectTasks([]);
  };

  const handleAddTask = (title: string) => {
    if (!title) return;

    setProjectTasks([
      ...projectTasks,
      { id: String(Math.random()), title, complete: false },
    ]);

    setTaskTitle("");
  };

  const handleDeleteTask = (taskId: string) => {
    setProjectTasks(projectTasks.filter((task) => task.id !== taskId));
  };

  return (
    <Modal
      title="Создание проекта"
      open={isOpen}
      okText="Создать проект"
      cancelText="отмена"
      onCancel={handleCloseButton}
      onOk={() =>
        handleCreateProjectButton(
          projectNameTitle,
          projectWorkerIds,
          projectTasks
        )
      }
    >
      <Form>
        <Form.Item label="Название:">
          <Input value={projectNameTitle} onChange={handleChangeProjectName} />
        </Form.Item>
        <Form.Item label="Участники:">
          <Select
            allowClear
            mode="multiple"
            value={projectWorkerIds}
            onChange={handleChangeWorkersSelect}
            options={workers.map((worker) => ({
              label: worker.name,
              value: worker.id,
            }))}
          ></Select>
        </Form.Item>
        <Form.Item label="Задачи:">
          <Space.Compact className={styled.taskInput}>
            <Input value={taskTitle} onChange={handleTaskTitle} />
            <Button
              onClick={() => handleAddTask(taskTitle.trim())}
              type="primary"
            >
              Добавить
            </Button>
          </Space.Compact>
          <List
            size="default"
            bordered
            dataSource={projectTasks}
            renderItem={(item) => (
              <List.Item key={item.id} className={styled.taskList}>
                <div>{item.title}</div>
                <Button onClick={() => handleDeleteTask(item.id)}>
                  удалить
                </Button>
              </List.Item>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateModal;
