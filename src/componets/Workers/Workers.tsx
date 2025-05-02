import { ChangeEvent, FC, useEffect, useState } from "react";
import { Button, Card, Input, Space } from "antd";
import styled from "./Workers.module.css";
import { WorkersType } from "../../pages/MainPage/MainPage";

interface WorkersProps {
  defaultWorkers: WorkersType[];
}

const Workers: FC<WorkersProps> = ({ defaultWorkers }) => {
  const [searchTitle, setSearchTitle] = useState("");
  const [workers, setWorkers] = useState<WorkersType[]>([]);

  useEffect(() => {
    setWorkers(defaultWorkers);
  }, [defaultWorkers]);

  const handleSearchWorkers = () => {
    setWorkers(
      defaultWorkers.filter((worker) =>
        worker.name
          .toLocaleLowerCase()
          .trim()
          .includes(searchTitle.toLocaleLowerCase().trim())
      )
    );
  };

  return (
    <div className={styled.container}>
      <div className={styled.searchWorker}>
        <Space.Compact>
          <Input
            value={searchTitle}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              setSearchTitle(event.target.value)
            }
            className={styled.search}
            placeholder="Поиск рабочих"
          />
          <Button onClick={handleSearchWorkers} type="primary">
            Поиск
          </Button>
        </Space.Compact>
      </div>

      <div className={styled.workersContainer}>
        {workers.map((worker) => (
          <Card key={worker.id} title={worker.name}>
            <div>{worker.specialization}</div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Workers;
