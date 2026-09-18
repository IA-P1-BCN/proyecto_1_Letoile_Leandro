from backend.domain.taximeter import Taximeter


def show_instructions():
    print("\n🚕 TaxiTech Solutions — Taxímetro Digital")
    print("------------------------------------------")
    print("Comandos disponibles:")
    print("  start  → iniciar una carrera")
    print("  move   → taxi en movimiento")
    print("  stop   → taxi detenido")
    print("  finish → finalizar una carrera")
    print("  quit   → salir del programa")


def main():
    print("🚕 Bienvenido al Taxímetro Digital")

    taximeter = Taximeter()

    while True:
        show_instructions()

        command = input("\n> ").strip().lower()

        if command == "start":
            success, message = taximeter.start()

            print(f"\n{message}")

            if success:
                print("🛑 Estado: detenido")
                print("💰 Tarifa: 0.02 €/segundo")

        elif command == "move":
            success, message = taximeter.move()

            print(f"\n{message}")

            if success:
                print("💰 Tarifa: 0.05 €/segundo")

        elif command == "stop":
            success, message = taximeter.stop()

            print(f"\n{message}")

            if success:
                print("💰 Tarifa: 0.02 €/segundo")

        elif command == "finish":
            success, result = taximeter.finish()

            if not success:
                print(f"\n{result}")
                continue

            print("\n🏁 Carrera finalizada")

            print(
                f"🛑 Tiempo detenido: "
                f"{result['stopped_time']:.2f} segundos"
            )

            print(
                f"🚗 Tiempo en movimiento: "
                f"{result['moving_time']:.2f} segundos"
            )

            print(
                f"💰 Coste detenido: "
                f"€{result['stopped_cost']:.2f}"
            )

            print(
                f"💰 Coste movimiento: "
                f"€{result['moving_cost']:.2f}"
            )

            print(
                f"💵 TOTAL: "
                f"€{result['total']:.2f}"
            )

        elif command == "quit":
            print("\n👋 Programa finalizado")
            break

        else:
            print("\n❌ Comando no válido")


if __name__ == "__main__":
    main()